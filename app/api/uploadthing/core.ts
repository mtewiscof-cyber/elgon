import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      try {
        // For simplicity, we're not doing complex auth checks here
        // In a real app, you'd validate a session or token
        
        // Return metadata for onUploadComplete
        return { 
          // Pass any values you want to be available in onUploadComplete
          userId: "user-123" // simplified for demo
        };
      } catch (error) {
        console.error("Auth error:", error);
        throw new UploadThingError("Authentication failed");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for user:", metadata.userId);
      console.log("File URL:", file.url);

      // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { url: file.url };
    }),

  // New route specifically for product images
  productImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 5, // Allow multiple images for product gallery
    },
  })
    .middleware(async ({ req }) => {
      try {
        // For simplicity, we're skipping complex auth in this demo
        // You could implement more complex checks here in a real app
        
        // This is simplified for demo purposes
        return { 
          userId: "admin-123" // simplified for demo
        };
      } catch (error) {
        console.error("Auth error:", error);
        throw new UploadThingError("Authentication failed");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Product image uploaded by user:", metadata.userId);
      console.log("Product image URL:", file.url);
      
      return { 
        url: file.url 
      };
    }),

  // Blog image upload route
  imageBlogFile: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      try {
        // Simple demo auth, replace with real user/session check if needed
        return { userId: "blog-author-123" };
      } catch (error) {
        console.error("Auth error:", error);
        throw new UploadThingError("Authentication failed");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Blog image uploaded by user:", metadata.userId);
      console.log("Blog image URL:", file.url);
      return { url: file.url };
    }),

  // News image upload route
  imageNewsFile: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      try {
        // Simple demo auth, replace with real user/session check if needed
        return { userId: "news-author-123" };
      } catch (error) {
        console.error("Auth error:", error);
        throw new UploadThingError("Authentication failed");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("News image uploaded by user:", metadata.userId);
      console.log("News image URL:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
