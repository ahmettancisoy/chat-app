import RegisterForm from "./components/RegisterForm";
import SignInForm from "./components/SignInForm";
import LoginOrRegister from "./components/LoginOrRegister";

const AuthLayout = (props) => {
  return (
    <div className="w-screen h-screen bg-gradient-to-b from-white to-blue-100">
      <div className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 translate-y-[10rem] px-4">
        <div className="absolute left-1/2 -top-20 -translate-x-1/2">
          <img
            className="mx-auto h-12 w-auto inline-block"
            src="/images/chat-64.png"
            alt="Chat App"
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
        <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
          <div className="p-4">
            {props.name === "login" ? <SignInForm /> : <RegisterForm />}
          </div>
        </div>
        <LoginOrRegister name={props.name} />
      </div>
    </div>
  );
};

export default AuthLayout;
