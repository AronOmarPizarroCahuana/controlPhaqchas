import Image from "@/components/login/image-login/image-login";
import Form from "@/components/login/login-form/login-form";

export default function Home() {
  return (
    <div className="h-screen flex bg-gradient-to-r from-[#E4E57D] via-[#71A7C9] to-[#F8F8F8]">
      {/* Imagen oculta hasta que se supere el tamaño 1319px */}
      <div className="hidden lg:flex w-1/2 justify-center items-center opacity-0 lg:opacity-100 animate-fadeIn">
        <Image />
      </div>

      {/* Formulario siempre visible y ocupa toda la pantalla en dispositivos móviles */}
      <div className="w-full lg:w-1/2 flex justify-center items-center opacity-0 lg:opacity-100 animate-fadeIn">
        <Form />
      </div>
    </div>
  );
}
