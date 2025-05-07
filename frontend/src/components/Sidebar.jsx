"use client";

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
} from "@chakra-ui/react";

import { FiHome, FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { CiHeart } from "react-icons/ci";
import { BiSolidPlaylist } from "react-icons/bi";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const LinkItems = [
  { name: "Home", icon: FiHome, route: "/" },
  { name: "Likes", icon: CiHeart, route: "/likes" },
  { name: "My Playlists", icon: BiSolidPlaylist, route: "/playlist" },
];

const SidebarContent = ({ onClose, ...rest }) => {
  const navigate = useNavigate();

  const handleRouteClick = (route) => {
    navigate(route);
  };

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "musiq.dark")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "musiq.dark")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          MusiQ 360
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          onClick={() => handleRouteClick(link.route)}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "musiq.orange",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen }) => {
  const { logout, userDetails, refreshUserDetails, token } = useAuth();
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (userDetails) {
      setForm({
        name: userDetails.name || "",
        email: userDetails.email || "",
        password: "",
      });
    }
  }, [userDetails, isModalOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const update = {
        name: form.name,
        email: form.email,
      };
      if (form.password) update.password = form.password;

      await axios.put(`/api/users/profile`, update, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: "Profile updated!",
        description: "Your changes have been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await refreshUserDetails();
      closeModal();
    } catch (err) {
      console.error(err);
      toast({
        title: "Update failed",
        description: err.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        bg={useColorModeValue("white", "musiq.dark")}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue("musiq.dark", "musiq.dark")}
        justifyContent={{ base: "space-between", md: "flex-end" }}
      >
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />

        <Text
          display={{ base: "flex", md: "none" }}
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
        >
          MusiQ 360
        </Text>

        <HStack spacing={{ base: "0", md: "6" }}>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton py={2}>
                <HStack>
                  <Avatar
                    size={"sm"}
                    src={
                      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/640px-User_icon_2.svg.png"
                    }
                  />
                  <VStack
                    display={{ base: "none", md: "flex" }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm" className="uppercase">
                      {userDetails.name}
                    </Text>
                  </VStack>
                  <Box display={{ base: "none", md: "flex" }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={openModal}>Settings</MenuItem>
                <MenuDivider />
                <MenuItem onClick={logout}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </HStack>
      </Flex>

      <Modal isOpen={isModalOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!userDetails ? (
              <Spinner />
            ) : (
              <>
                <FormControl mb={3}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>New Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                  />
                </FormControl>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeModal} variant="ghost" mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={loading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const Sidebar = ({ Outlet }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("musiq.light", "musiq.dark")}>
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet />
      </Box>
    </Box>
  );
};

export default Sidebar;
