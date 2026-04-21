# Next.js template

This is a Next.js template with shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

````javascript
 <script>
      (async () => {
        const API_URL = "https://image-api.prithivipemimagar.workers.dev/";
        const API_KEY =
          "Bearer ad184155b0b1ef7ee99d44141d7e99eeebb5ab92885d9d15d93768845009d020";

        async function generateImage(title, payload) {
          const section = document.createElement("section");
          const heading = document.createElement("h3");
          heading.textContent = title;
          section.appendChild(heading);
          document.body.appendChild(section);

          const res = await fetch(API_URL, {
            method: "POST",
            headers: {
              Authorization: API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const errorText = await res.text();
            const pre = document.createElement("pre");
            pre.textContent = `Request failed (${res.status}): ${errorText}`;
            section.appendChild(pre);
            return;
          }

          const blob = await res.blob();
          const img = document.createElement("img");
          img.src = URL.createObjectURL(blob);
          img.style.height = "360px";
          img.style.display = "block";
          section.appendChild(img);
        }

        // Example 1: prompt only
        await generateImage("Example 1 - prompt only", {
          prompt: "A frog wearing sunglasses.",
        });

        // Example 2: prompt + preferred model
        await generateImage("Example 2 - prompt + model", {
          prompt: "A futuristic city in the clouds",
          model: "@cf/bytedance/stable-diffusion-xl-lightning",
        });
      })();
    </script>
    ```
````
