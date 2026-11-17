import { File01Icon } from "@hugeicons/core-free-icons";
import { Attachment, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from "@beam/ui/components/attachment";
import { Icon } from "@beam/ui/icons";

export default function AttachmentDefault() {
  return (
    <Attachment className="w-[320px]">
      <AttachmentMedia>
        <Icon icon={File01Icon} size="sm" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>invoice-1042.pdf</AttachmentTitle>
        <AttachmentDescription>84 KB</AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  );
}
