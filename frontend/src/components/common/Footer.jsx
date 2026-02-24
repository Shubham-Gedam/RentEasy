const Footer = () => (
  <footer className="border-t border-gray-100 py-12 px-8 bg-white mt-20">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="font-black text-xl italic uppercase tracking-tighter">
        Rent<span className="text-blue-600">Ease</span>.
      </p>
      <p className="text-gray-400 text-sm font-medium">© 2026 RentEase Inc. Made with ❤️ for renters.</p>
      <div className="flex gap-6 text-xs font-black uppercase tracking-widest text-gray-400">
        <span className="hover:text-black cursor-pointer">Terms</span>
        <span className="hover:text-black cursor-pointer">Privacy</span>
        <span className="hover:text-black cursor-pointer">Support</span>
      </div>
    </div>
  </footer>
);
export default Footer;