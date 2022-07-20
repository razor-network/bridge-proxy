import { HStack, IconButton, useColorMode, VStack } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack justifyContent="flex-end" alignItems="flex-end" m="4">
      <IconButton
        mr="2"
        onClick={toggleColorMode}
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      />
      <ConnectButton />
    </HStack>
  );
};

export default Header;
