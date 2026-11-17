import { Globe02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@beam/ui/components/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@beam/ui/components/item";
import { Icon } from "@beam/ui/icons";

export default function ItemDefault() {
  return (
    <Item variant="outline" className="w-[480px]">
      <ItemMedia>
        <Icon icon={Globe02Icon} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Payment links</ItemTitle>
        <ItemDescription>Share a link and get paid without a website.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">Create</Button>
      </ItemActions>
    </Item>
  );
}
