"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useEnsName } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import GenerateContentStreamForm from "~~/components/GenerateContentStreamForm";
import VerifyContentForm from "~~/components/VerifyContentForm";
import PulseEffect from "~~/components/pulseEffect";


const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: ensName } = useEnsName({ address: connectedAddress });

  return (
    <>
      <PulseEffect />
      <main className="flex flex-col min-h-screen items-center justify-center text-white space-y-8 p-8">
        {/* Wallet Info */}
        <div className="flex flex-col items-center space-y-2">
          <p className="font-medium">Connected Wallet:</p>
          {ensName ? (
            <p className="text-lg font-semibold">{ensName}</p>
          ) : (
            <Address address={connectedAddress} />
          )}
        </div>

        {/* ✅ Streaming AI Content Generator */}
        <GenerateContentStreamForm />

        {/* ✅ Content Verification Form */}
        <div className="w-full max-w-xl mt-12">
          <VerifyContentForm />
        </div>

        {/* ✅ Link to Explorer (optional CTA) */}
        <Link
          href="/explorer"
          className="mt-8 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-secondary transition"
        >
          Go to CredifAI Explorer 🔍
        </Link>

        <p className="text-center text-lg">
          Get started by editing{" "}
          <code className="italic bg-base-300 text-base font-bold break-words break-all inline-block">
            packages/nextjs/app/page.tsx
          </code>
        </p>
        <p className="text-center text-lg">
          Edit your smart contract{" "}
          <code className="italic bg-base-300 text-base font-bold break-words break-all inline-block">
            YourContract.sol
          </code>{" "}
          in{" "}
          <code className="italic bg-base-300 text-base font-bold break-words break-all inline-block">
            packages/hardhat/contracts
          </code>
        </p>
      </main>

      {/* Developer Tools */}
      <div className="grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
          {/* Debug Contract */}
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <BugAntIcon className="h-8 w-8 fill-secondary" />
            <p>
              Tinker with your smart contract using{" "}
              <Link href="/debug" className="link">Debug Contracts</Link>.
            </p>
          </div>

          {/* Block Explorer */}
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
            <p>
              Explore your local transactions in the{" "}
              <Link href="/blockexplorer" className="link">Block Explorer</Link>.
            </p>
          </div>

          {/* ✅ CredifAI Explorer Card */}
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
            <p>
              Verify AI-generated content with the{" "}
              <Link href="/explorer" className="link">CredifAI Explorer</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
