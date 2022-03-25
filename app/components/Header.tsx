import { Link, useLocation } from "remix";
import clsx from "clsx";
import ConnectWallet from "./connect-wallet";
export default function Header() {
  const location = useLocation();

  return (
    <div className="flex c mt-8">
      <div className="flex-grow">
        <a href="/">
          <img src="/images/logo.svg" alt="Tender Finance" />
        </a>
      </div>
      <div>
        <button
          className={clsx("bg-brand-green text-white py-2 px-4", {
            hidden: location.pathname !== "/",
          })}
        >
          <Link to="/app">Enter App</Link>
        </button>
        <div
          className={clsx("", {
            hidden: location.pathname === "/",
          })}
        >
          <ConnectWallet />
        </div>
      </div>
    </div>
  );
}
