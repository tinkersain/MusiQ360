import {
    useToast
} from "@chakra-ui/react";

export const useNotification = () => {
    const toast = useToast();

    const success = (title, description = "", options = {}) => {
        toast({
            title,
            description,
            status: "success",
            duration: 5000,
            isClosable: true,
            ...options,
        });
    };

    const error = (title, description = "", options = {}) => {
        toast({
            title,
            description,
            status: "error",
            duration: 5000,
            isClosable: true,
            ...options,
        });
    };

    return {
        success,
        error
    };
};