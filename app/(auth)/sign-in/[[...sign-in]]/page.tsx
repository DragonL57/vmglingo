
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

const SignInPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <Image src="/logo.svg" alt="Logo" width={120} height={120} priority />
      <SignIn />
    </div>
  );
};

export default SignInPage;
