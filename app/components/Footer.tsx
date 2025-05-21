import { MdSecurity } from 'react-icons/md'
import { FaPlane, FaHeadset, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-white mt-auto">
      {/* Top Section - Features */}
      <div className="w-full bg-gray-700 text-white py-8 flex flex-col md:flex-row justify-between items-center border-t-4 border-blue-800 ring-2 ring-black px-4">
        <div className="flex items-center mb-4 md:mb-0 md:pl-10">
          <MdSecurity className="text-2xl" />
          <p className="pl-2 font-medium">100% <span className="italic">seguro</span></p>
        </div>
        
        <div className="flex items-center mb-4 md:mb-0">
          <FaPlane className="text-2xl" />
          <p className="pl-2 font-medium">Para qualquer lugar nacionalmente</p>
        </div>
        
        <div className="flex items-center md:pr-10">
          <FaHeadset className="text-2xl" />
          <p className="pl-2 font-medium">Suporte automatizado por IA</p>
        </div>
      </div>

      {/* Bottom Section - Links */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Social Media */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-xl mb-6">Social Media</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <Link 
              href="https://www.instagram.com/_fargila/" 
              target="_blank"
              rel="noopener noreferrer"
              className="
                border border-black rounded-full text-2xl p-2 
                bg-white hover:bg-pink-50 
                text-pink-600 hover:text-pink-700 
                transition-colors duration-200
                shadow-sm hover:shadow-md
                flex items-center justify-center
              "
              aria-label="Instagram"
            >
              <FaInstagram />
            </Link>
            
            <Link 
              href="https://www.linkedin.com/in/%C3%A1tila-fran%C3%A7a-8066a0249/" 
              target="_blank"
              rel="noopener noreferrer"
              className="
                border border-black rounded-full text-2xl p-2 
                bg-white hover:bg-blue-50 
                text-blue-600 hover:text-blue-700 
                transition-colors duration-200
                shadow-sm hover:shadow-md
                flex items-center justify-center
              "
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </Link>
          </div>
        </div>

        {/* Team Members */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-xl mb-6">Team members</h3>
          <ul className="space-y-2">
            <li>Átila França do Nascimento</li>
            <li>Cauê Cassiano dos Santos</li>
            <li>Arthur do Amaral da Silva</li>
          </ul>
        </div>

        {/* About Us */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-xl mb-6">About Us</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                href="https://www.unipe.edu.br/" 
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-gray-700 hover:text-blue-600 
                  transition-colors duration-200
                  hover:underline underline-offset-4
                "
              >
                Our institution
              </Link>
            </li>
            <li>About this project (in progress)</li>
          </ul>
        </div>

        {/* Useful Links */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-xl mb-6">Useful Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="https://blog.magezon.com/website-shopping-cart-page-ultimate-guide-ecm/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-gray-700 hover:text-blue-600 
                  transition-colors duration-200
                  hover:underline underline-offset-4
                "
              >
                Cart's ref.
              </Link>
            </li>
            <li>
              <Link
                href="https://cssauthor.com/e-commerce-template-psd-for-online-bookstore/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-gray-700 hover:text-blue-600 
                  transition-colors duration-200
                  hover:underline underline-offset-4
                "
              >
                Catalog's ref.
              </Link>
            </li>
            <li>
              <Link
                href="https://nerdcave.com/tailwind-cheat-sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-gray-700 hover:text-blue-600 
                  transition-colors duration-200
                  hover:underline underline-offset-4
                "
              >
                TailwindCSS styles sheets
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center py-4 border-t border-gray-200 text-gray-600">
        <p>&copy; {new Date().getFullYear()} Bookstore Project. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer