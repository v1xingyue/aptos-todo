import Image from "next/image";
import { AptosConnect } from "./AptosConnect";
import {
  MODULE_URL
} from "../config/constants";

export function NavBar() {
  return (
    <nav className="navbar py-4 px-4 bg-base-100">
      <div className="flex-1">
        <a href="http://movedid.build" target="_blank" rel="noreferrer">
          <Image src="/logo.png" width={64} height={64} alt="logo" />
        </a>
        <ul className="menu menu-horizontal p-0 ml-5">
          <li className="font-sans font-semibold text-lg">
            <a href="https://github.com/v1xingyue/aptos-todo" target="_blank" rel="noreferrer">Source Code</a>
            <a href={MODULE_URL} target="_blank" rel="noreferrer">Contract on Explorer</a>
          </li>
        </ul>
      </div>
      <AptosConnect />
    </nav>
  );
}
