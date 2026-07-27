# Local Mapping Example

Create a local component mapping:

```bash
beam mappings add --figma-component-id 123:456 --figma-name "Button / Primary" --import "@/components/button" --export Button
beam mappings list
```

Mappings are stored in the project `.beam/mappings.json` file and contain no credentials.
