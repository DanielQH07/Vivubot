import React, { useState, useEffect, useCallback } from 'react';
import {
    Flex, Box, VStack, Text, Input, Button, useToast, Image,
    HStack, Checkbox, CheckboxGroup, Stack, SimpleGrid, // Thêm SimpleGrid vào đây
    Menu, MenuButton, MenuList, MenuItem
} from '@chakra-ui/react';
import { ChatIcon, SearchIcon, SettingsIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- LOGGING VỊ TRÍ 1: Ngay khi component được định nghĩa ---
console.log("PreferencesPage.jsx: Component file loaded and defined.");

const PreferencesPage = () => {
    // --- LOGGING VỊ TRÍ 2: Ngay đầu hàm component (mỗi lần render) ---
    console.log("PreferencesPage: Component function executed (render).");

    const navigate = useNavigate();
    const toast = useToast();
    const { pathname } = useLocation();

    // Lấy user và token một cách an toàn
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            if (storedToken) {
                setToken(storedToken);
            }
        } catch (error) {
            console.error("PreferencesPage: Error parsing user or token from localStorage:", error);
            // Optionally, clear invalid data
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
        }
    }, []); // Chỉ chạy một lần khi component mount

    const username = user?.username || "Username";

    const [preferences, setPreferences] = useState({
        travelStyle: [],
        locationType: [],
        cuisineType: [],
        budgetLevel: [],
        travelTime: [],
        customTravelStyle: '',
        customLocationType: '',
        customCuisineType: '',
        customBudgetLevel: '',
        customTravelTime: '',
    });

    const travelStylesOptions = ['Phiêu lưu', 'Thư giãn', 'Cổ kính', 'Hiện đại', 'Tự nhiên', 'Khác'];
    const locationTypesOptions = ['Biển', 'Núi', 'Thành phố', 'Nông thôn', 'Rừng', 'Khác'];
    const cuisineTypesOptions = ['Việt Nam', 'Âu', 'Á', 'Chay', 'Hải sản', 'Khác'];
    const budgetLevelsOptions = ['Thấp', 'Trung bình', 'Cao', 'Khác'];
    const travelTimesOptions = ['Mùa hè', 'Mùa đông', 'Mùa xuân', 'Mùa thu', 'Khác'];

    const categoryOptionsMap = {
        travelStyle: travelStylesOptions,
        locationType: locationTypesOptions,
        cuisineType: cuisineTypesOptions,
        budgetLevel: budgetLevelsOptions,
        travelTime: travelTimesOptions,
    };

    // --- LOGIC FETCH PREFERENCES ---
    useEffect(() => {
        // --- LOGGING VỊ TRÍ 3: Ngay đầu useEffect fetching data ---
        console.log("PreferencesPage: useEffect for fetching preferences started.");

        if (!user || !user.id || !token) {
            console.warn("PreferencesPage: User, user.id or token missing. Skipping API call.");
            console.log("Current user:", user);
            console.log("Current token:", token);
            // navigate('/login'); // Có thể bỏ comment nếu muốn tự động chuyển hướng
            return;
        }

        console.log("PreferencesPage: User and token present, attempting API call.");
        axios.get(`http://localhost:5000/api/auth/preferences`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
            // --- LOGGING VỊ TRÍ 4: API call thành công ---
            console.log('PreferencesPage: API Response data received:', res.data);
            const fetchedPrefs = res.data.preferences || {};

            const newPreferencesState = {
                travelStyle: [], locationType: [], cuisineType: [], budgetLevel: [], travelTime: [],
                customTravelStyle: '', customLocationType: '', customCuisineType: '', customBudgetLevel: '', customTravelTime: '',
            };

            Object.keys(categoryOptionsMap).forEach(categoryKey => {
                const fetchedValues = fetchedPrefs[categoryKey] || [];
                const predefinedOptions = categoryOptionsMap[categoryKey];

                const selectedPredefined = [];
                let customValue = '';
                let hasCustomOption = false;

                fetchedValues.forEach(value => {
                    if (predefinedOptions.includes(value)) {
                        selectedPredefined.push(value);
                    } else {
                        customValue = value;
                        hasCustomOption = true;
                    }
                });

                if (hasCustomOption) {
                    selectedPredefined.push('Khác');
                    newPreferencesState[`custom${categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}`] = customValue;
                }
                newPreferencesState[categoryKey] = selectedPredefined;

                console.log(`PreferencesPage: Processed ${categoryKey}. Selected:`, selectedPredefined, `Custom:`, customValue);
            });

            console.log('PreferencesPage: Final newPreferencesState before setPreferences:', newPreferencesState);
            setPreferences(newPreferencesState);
        })
        .catch(err => {
            // --- LOGGING VỊ TRÍ 5: API call thất bại ---
            console.error('PreferencesPage: Error fetching preferences:', err.response?.data?.message || err.message || err);
            toast({
                title: 'Lỗi tải sở thích',
                description: 'Không thể lấy dữ liệu sở thích đã lưu của bạn.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        });
    }, [user, token, toast]); // Dependency array: useEffect will run when user or token changes

    // Sử dụng useCallback để tránh tạo lại hàm khi re-render
    const handleSubmit = useCallback(async (e) => {
        // --- LOGGING VỊ TRÍ 6: Hàm handleSubmit được gọi ---
        console.log("PreferencesPage: handleSubmit called.");
        if (e) e.preventDefault(); // Đảm bảo ngăn chặn hành vi mặc định của form nếu có

        // Đảm bảo user và token có giá trị trước khi gửi
        if (!user || !token) {
            console.error("PreferencesPage: handleSubmit called but user or token is missing.");
            toast({
                title: 'Lỗi',
                description: 'Vui lòng đăng nhập lại để lưu sở thích.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            console.log("PreferencesPage: Attempting to save preferences via PUT request.");
            const dataToSend = {};
            Object.keys(categoryOptionsMap).forEach(category => {
                const customKey = `custom${category.charAt(0).toUpperCase() + category.slice(1)}`;
                let finalValues = [...preferences[category]];

                if (finalValues.includes('Khác')) {
                    finalValues = finalValues.filter(s => s !== 'Khác');
                    if (preferences[customKey]) {
                        finalValues.push(preferences[customKey]);
                    }
                }
                dataToSend[category] = finalValues;
            });
            console.log("PreferencesPage: Data to send:", dataToSend);

            await axios.put('http://localhost:5000/api/auth/preferences', dataToSend, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // --- LOGGING VỊ TRÍ 7: Lưu thành công ---
            console.log("PreferencesPage: Preferences saved successfully. Navigating to /chat.");
            
            // Cập nhật user data với hasPreferences = true
            const updatedUser = { ...user, hasPreferences: true };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            toast({
                title: 'Sở Thích Đã Lưu',
                description: 'Sở thích du lịch của bạn đã được cập nhật.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate('/chat');
        } catch (err) {
            // --- LOGGING VỊ TRÍ 8: Lưu thất bại ---
            console.error("PreferencesPage: Failed to save preferences:", err.response?.data || err.message || err);
            toast({
                title: 'Lỗi',
                description: `Không thể lưu sở thích. ${err.response?.data?.message || err.message || "Lỗi không xác định."}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }, [preferences, user, token, navigate, toast, categoryOptionsMap]); // Dependencies for useCallback

    const handleCustomInput = useCallback((category, value) => {
        setPreferences(prev => ({
            ...prev,
            [`custom${category.charAt(0).toUpperCase() + category.slice(1)}`]: value,
        }));
    }, []);

    const handleCheckboxChange = useCallback((category, values) => {
        setPreferences(prev => ({ ...prev, [category]: values }));
    }, []);

    const renderPreferenceSection = (category, options) => (
        <Box p={4} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="sm">
            <Text fontSize="lg" fontWeight="semibold" mb={3} color="gray.700">
                {category.replace(/([A-Z])/g, ' $1').replace('traveltime', 'Travel Time').replace('travelstyle', 'Travel Style').replace('locationtype', 'Location Type').replace('cuisinetype', 'Cuisine Type').replace('budgetlevel', 'Budget Level')}
            </Text>
            <CheckboxGroup value={preferences[category]} onChange={(values) => handleCheckboxChange(category, values)}>
                {/* SỬ DỤNG SIMPLEGRID ĐỂ TẠO BỐ CỤC LƯỚI THẲNG HÀNG */}
                <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, lg: 4 }} // Số cột tùy thuộc vào kích thước màn hình
                    spacing={4} // Khoảng cách giữa các ô trong lưới
                    minChildWidth="120px" // Đảm bảo mỗi ô có chiều rộng tối thiểu, các ô sẽ giãn ra để lấp đầy
                >
                    {options.map(option => (
                        // Mỗi Checkbox được bọc trong một Box để kiểm soát kích thước và thẳng hàng
                        <Box key={option}>
                            <Checkbox value={option} size="md">
                                {option}
                            </Checkbox>
                        </Box>
                    ))}
                </SimpleGrid>
            </CheckboxGroup>
            {preferences[category].includes('Khác') && (
                <Input
                    mt={3}
                    placeholder={`Nhập lựa chọn tùy chỉnh của bạn`}
                    value={preferences[`custom${category.charAt(0).toUpperCase() + category.slice(1)}`]}
                    onChange={(e) => handleCustomInput(category, e.target.value)}
                    focusBorderColor="teal.400"
                />
            )}
        </Box>
    );

    return (
        <Flex h="100vh">
            {/* Sidebar */}
            <Flex
                direction="column"
                w="250px"
                bg="gray.50"
                borderRight="1px solid"
                borderColor="gray.200"
                h="100vh"
                p={4}
            >
                {/* Logo */}
                <VStack spacing={1} align="center">
                    <Image src="/logo.png" boxSize="200px" objectFit="contain" alt="Logo" fallbackSrc="https://via.placeholder.com/200/cccccc/333333?text=Logo" />
                </VStack>

                {/* Sticky Nav (Chat / Explore) */}
                <Box
                    position="sticky"
                    top="0"
                    bg="gray.50"
                    zIndex="1"
                    py={2}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                >
                    <VStack spacing={4} align="stretch">
                        <Link to="/chat">
                            <HStack
                                color={pathname === '/chat' ? 'teal.500' : 'gray.600'}
                                fontSize="lg"
                                spacing={4}
                                pl={4}
                                _hover={{ color: 'teal.600' }}
                            >
                                <ChatIcon boxSize={5} />
                                <Text>Chat</Text>
                            </HStack>
                        </Link>
                        <Link to="/explore">
                            <HStack
                                color={pathname === '/explore' ? 'teal.500' : 'gray.600'}
                                fontSize="lg"
                                spacing={4}
                                pl={4}
                                _hover={{ color: 'teal.600' }}
                            >
                                <SearchIcon boxSize={5} />
                                <Text>Explore</Text>
                            </HStack>
                        </Link>
                    </VStack>
                </Box>

                {/* Spacer */}
                <Box flex={1} />

                {/* User Dropup Menu */}
                <Menu placement="top-start">
                    <MenuButton as={Button} variant="ghost" px={2} py={1} rightIcon={<ChevronUpIcon />}>
                        <HStack spacing={2}>
                            <SettingsIcon />
                            <Text>{username}</Text>
                        </HStack>
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => navigate('/preferences')}>
                            Preferences
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                console.log("PreferencesPage: Logging out.");
                                localStorage.removeItem('vivubot_session_id');
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                setUser(null); // Clear state as well
                                setToken(null);
                                navigate('/');
                            }}
                        >
                            Logout
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>

            {/* Preferences Form - Main Content */}
            <Flex direction="column" flex="2" p={6} bg="gray.100" overflowY="auto">
                <Box mb={6}>
                    <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={1}>Travel Preferences</Text>
                    <Text fontSize="md" color="gray.600">Hãy cho chúng tôi biết sở thích du lịch của bạn để có những gợi ý tốt nhất!</Text>
                </Box>
                <VStack spacing={6} align="stretch">
                    {renderPreferenceSection('travelStyle', travelStylesOptions)}
                    {renderPreferenceSection('locationType', locationTypesOptions)}
                    {renderPreferenceSection('cuisineType', cuisineTypesOptions)}
                    {renderPreferenceSection('budgetLevel', budgetLevelsOptions)}
                    {renderPreferenceSection('travelTime', travelTimesOptions)}

                    <Button
                        colorScheme="teal"
                        size="lg"
                        w="full"
                        mt={6}
                        onClick={handleSubmit} // Đây là nút chính, đảm bảo không nằm trong form hoặc đã xử lý submit
                        _hover={{ bg: 'teal.500' }}
                    >
                        Lưu Sở Thích
                    </Button>
                </VStack>
            </Flex>
        </Flex>
    );
};

export default PreferencesPage;