function Header() {

  return (
    <>
      <header className="w-full h-16 flex justify-between items-center bg-[#f0f0f0] px-4">
        <img src="/ifms_logo.png" alt="Logo da instituição" className="w-16 h-12"/>
        <img src="/profile.png" alt="Imagem de Perfil" className="w-12 h-12 rounded-full border-2 border-[#afb3b0] cursor-pointer"/>
      </header>
    </>
  );
}

export default Header;
