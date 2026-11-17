import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@beam/ui/components/menubar";

export default function MenubarDefault() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New invoice</MenubarItem>
          <MenubarItem>Export</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Test data</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
