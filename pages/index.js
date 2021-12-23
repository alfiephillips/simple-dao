import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Home() {
  const [greeting, setGreetingValue] = useState("");
  const [data, setData] = useState("");

  async function requestAccount() {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (err) {
      throw err;
    }
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        setData(data);
        console.log("Returned data: ", data);
      } catch (err) {
        throw err;
      }
    } else {
      console.log("Metamask is not installed.");
    }
  }

  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
    } else {
      console.log("Metamask is not installed.");
    }
  }
  return (
    <div>
      <header>
        <button onClick={fetchGreeting}>fetch greeting</button>
        <button onClick={setGreeting}>set greeting</button>
        <input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="enter greeting"
        />
      </header>
      <p>greeting: {data}</p>
    </div>
  );
}
