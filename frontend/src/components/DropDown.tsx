import { useEffect, useRef, useState } from "react";

export const DropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <header>
        <nav>
          <input
            type="button"
            className="text-3xl bg-blue text-light rounded p-2 m-4 text-center font-alumni font-bold"
            value="Meny"
            onClick={toggleDropdown}
          />
          {isOpen && (
            <ul className="dropdown-container menu bg-blue rounded-box w-56">
              <li>
                <details open>
                  <summary className="text-3xl text-light font-alumni">
                    <a href="#wedding">Bröllopet</a>
                  </summary>
                  <ul>
                    <li onClick={toggleDropdown}>
                      <a
                        className="text-2xl text-light font-alumni"
                        href="#osa"
                      >
                        OSA
                      </a>
                    </li>
                    <li onClick={toggleDropdown}>
                      <a
                        className="text-2xl text-light font-alumni"
                        href="#hotel"
                      >
                        Hotell
                      </a>
                    </li>
                    <li onClick={toggleDropdown}>
                      <a
                        className="text-2xl text-light font-alumni"
                        href="#map"
                      >
                        Hita hit
                      </a>
                    </li>
                    <li onClick={toggleDropdown}>
                      <a
                        className="text-2xl text-light font-alumni"
                        href="#songs"
                      >
                        Låtförslag
                      </a>
                    </li>
                    <li onClick={toggleDropdown}>
                      <a
                        className="text-2xl text-light font-alumni"
                        href="#gifts"
                      >
                        Gåvor
                      </a>
                    </li>
                  </ul>
                </details>
                <details open>
                  <summary className="text-3xl text-light font-alumni">
                    Program
                  </summary>
                  <ul>
                    <li onClick={toggleDropdown}>
                      <a
                        className="text-2xl text-light font-alumni"
                        href="#friday"
                      >
                        Uppladdning fredag
                      </a>
                    </li>
                    <li onClick={toggleDropdown}>
                      <a
                        className="text-2xl text-light font-alumni"
                        href="#location"
                      >
                        Om området
                      </a>
                    </li>
                    <li onClick={toggleDropdown}>
                      <a
                        className="text-2xl text-light font-alumni"
                        href="#wedding-ceremony"
                      >
                        Vigsel i Jonsered
                      </a>
                    </li>
                    <li onClick={toggleDropdown}>
                      <a
                        className="text-2xl text-light font-alumni"
                        href="#party"
                      >
                        Middag och fest
                      </a>
                    </li>
                    <li onClick={toggleDropdown}>
                      <a
                        className="text-2xl text-light font-alumni"
                        href="#speaches"
                      >
                        Tal
                      </a>
                    </li>
                    <li onClick={toggleDropdown}>
                      <a
                        className="text-2xl text-light font-alumni"
                        href="#dresscode"
                      >
                        Klädkod
                      </a>
                    </li>
                  </ul>
                  <div className="flex flex-row m-8">
                    <button
                      className="btn btn-circle self-end"
                      onClick={toggleDropdown}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </details>
              </li>
            </ul>
          )}
        </nav>
      </header>
    </>
  );
};
