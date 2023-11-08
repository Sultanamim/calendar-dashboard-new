import Image from "next/image";

export default function home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-24"
      style={{
        marginLeft: "20rem",
        marginTop: "2rem",
      }}
    >
      <div
        style={{
          width: "60rem",
          height: "20rem",
          backgroundColor: "#fff",
          color: "#000",
          padding: "2rem 1rem",
          borderRadius: "15px",
          textAlign: "center",
        }}
      >
        <h1>Hello Chris!</h1>
        <h4>
          This is your Dashboard Main Page. When you enter your dashboard by
          default this page will be shown. You can add here other things
          later...
        </h4>
      </div>
    </main>
  );
}
