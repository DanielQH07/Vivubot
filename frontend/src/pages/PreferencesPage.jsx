import React, { useState, useEffect, useCallback } from 'react';
import {
    Flex, Box, VStack, Text, Input, Button, useToast, Image,
    HStack, Checkbox, CheckboxGroup, Stack, SimpleGrid, // Thêm SimpleGrid vào đây
    Menu, MenuButton, MenuList, MenuItem
} from '@chakra-ui/react';
import { ChatIcon, SearchIcon, SettingsIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHiking, FaMapMarkerAlt, FaUtensils, FaMoneyBillWave, FaCalendarAlt, FaUmbrellaBeach, FaCity, FaLeaf, FaPagelines, FaFish, FaSeedling, FaRegClock, FaSpa, FaMountain, FaTree, FaHome, FaCar, FaBiking, FaPlane, FaShip, FaRegSmile, FaRegStar, FaRegSun, FaRegSnowflake, FaRegCalendarAlt } from 'react-icons/fa';

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

    // Icon mapping cho từng option
    const optionIcons = {
        // travelStyle
        'Phiêu lưu': <FaHiking color="#E53E3E" />, // đỏ
        'Thư giãn': <FaSpa color="#38A169" />, // xanh lá
        'Cổ kính': <FaPagelines color="#805AD5" />, // tím
        'Hiện đại': <FaCity color="#3182CE" />, // xanh dương
        'Tự nhiên': <FaLeaf color="#319795" />, // teal
        'Khác': <FaRegStar color="#D69E2E" />, // vàng

        // locationType
        'Biển': <FaUmbrellaBeach color="#3182CE" />,
        'Núi': <FaMountain color="#805AD5" />,
        'Thành phố': <FaCity color="#38A169" />,
        'Nông thôn': <FaHome color="#D69E2E" />,
        'Rừng': <FaTree color="#319795" />,
        // ...

        // cuisineType
        'Việt Nam': <FaUtensils color="#E53E3E" />,
        'Âu': <FaFish color="#3182CE" />,
        'Á': <FaSeedling color="#38A169" />,
        'Chay': <FaLeaf color="#319795" />,
        'Hải sản': <FaFish color="#805AD5" />,

        // budgetLevel
        'Thấp': <FaMoneyBillWave color="#38A169" />,
        'Trung bình': <FaMoneyBillWave color="#D69E2E" />,
        'Cao': <FaMoneyBillWave color="#E53E3E" />,

        // travelTime
        'Mùa hè': <FaRegSun color="#E53E3E" />,
        'Mùa đông': <FaRegSnowflake color="#3182CE" />,
        'Mùa xuân': <FaSeedling color="#38A169" />,
        'Mùa thu': <FaRegSmile color="#D69E2E" />,
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
            window.location.href = '/chat';
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

    const renderPreferenceSection = (category, options, label, icon) => (
        <Box p={4} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="sm">
            <Text fontSize="lg" fontWeight="semibold" mb={3} color="gray.700" display="flex" alignItems="center">
                {icon} {label}
            </Text>
            <CheckboxGroup value={preferences[category]} onChange={(values) => handleCheckboxChange(category, values)}>
                <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                    spacing={4}
                    minChildWidth="120px"
                >
                    {options.map(option => (
                        <Box key={option} display="flex" alignItems="center">
                            <Checkbox value={option} size="md">
                                <Box as="span" mr={2} display="inline-flex" alignItems="center">
                                    {optionIcons[option] || <FaRegStar color="#A0AEC0" />}
                                </Box>
                                {option}
                            </Checkbox>
                        </Box>
                    ))}
                </SimpleGrid>
            </CheckboxGroup>
            {preferences[category].includes('Khác') && (
                <Input
                    mt={3}
                    placeholder={`Nhập lựa chọn riêng của bạn...`}
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
                    <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={1}>Sở thích du lịch của bạn</Text>
                    <Text fontSize="md" color="gray.600">Hãy cho Vivubot biết sở thích để nhận gợi ý phù hợp nhất!</Text>
                </Box>
                <VStack spacing={6} align="stretch">
                    {renderPreferenceSection('travelStyle', travelStylesOptions, 'Phong cách du lịch', <FaHiking color="#319795" style={{marginRight: 8}} />)}
                    {renderPreferenceSection('locationType', locationTypesOptions, 'Loại địa điểm yêu thích', <FaMapMarkerAlt color="#319795" style={{marginRight: 8}} />)}
                    {renderPreferenceSection('cuisineType', cuisineTypesOptions, 'Ẩm thực yêu thích', <FaUtensils color="#319795" style={{marginRight: 8}} />)}
                    {renderPreferenceSection('budgetLevel', budgetLevelsOptions, 'Mức chi tiêu dự kiến', <FaMoneyBillWave color="#319795" style={{marginRight: 8}} />)}
                    {renderPreferenceSection('travelTime', travelTimesOptions, 'Thời gian du lịch mong muốn', <FaCalendarAlt color="#319795" style={{marginRight: 8}} />)}

                    <Button
                        colorScheme="teal"
                        size="lg"
                        w="full"
                        mt={6}
                        onClick={handleSubmit}
                        _hover={{ bg: 'teal.500' }}
                    >
                        Lưu sở thích
                    </Button>
                </VStack>
            </Flex>
        </Flex>
    );
};

export default PreferencesPage;