"use client";

import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";
import { UploadButton } from "@/utils/uploadthing";

export default function Home() {
  return (
    <>
      <Authenticated>
        <UserButton />
        <AuthenticatedContent />
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </>
  );
}

function AuthenticatedContent() {
  const createOrGetUser = useMutation(api.users.createOrGetUser);

  useEffect(() => {
    createOrGetUser();
  }, [createOrGetUser]);

  return (
    <div>
      <h1>Welcome to the app</h1>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

      
    </div>
  );
}
