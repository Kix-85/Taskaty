import Dashboard from "@/components/Dashboard";
// comment the above line and uncomment this line to import the Dashboard component
// import Dashboard from "@/pages/Dashboard";

const Home = () => {
  return (
    // Edit Overflow to hidden
    <div className="h-full bg-background flex flex-col ">
      <Dashboard />
    </div>
  );
};

export default Home;
