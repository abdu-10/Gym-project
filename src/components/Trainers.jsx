import React, { useState } from "react";
import TrainerBookingModal from "./TrainerBookingModal";

function Trainers() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);

    const trainers = [
        {
            name: "Hamudi Omar",
            role: "Strength Coach",
            image:'https://images.unsplash.com/photo-1694856872516-b89f1a9195d7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600',
            bio: "With 10 years of experience, Hamudi specializes in Powerlifting, and functional training. He is dedicated to helping clients build strength, improve performance, and achieve their fitness goals.",
            instagram: "#",
            facebook: "#",
            twitter: "#",
        },
        {
            name: "Mama Shawn",
            role: "Yoga Instructor",
            image:'https://images.unsplash.com/photo-1762021441225-8ac79c29f317?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1026',
            bio: "Mama Shawn is a certified yoga instructor with a passion for mindfulness and holistic wellness. She leads classes that cater to all levels, from beginners to advanced practitioners.",
            instagram: "#",
            facebook: "#",
            twitter: "#",
        },
        {
            name: "Douglas Omilana",
            role: "Personal Trainer",
            image:'https://plus.unsplash.com/premium_photo-1665461700538-0e790cf7bab8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=600',
            bio: "Douglas is a dedicated personal trainer who creates customized workout plans to help clients achieve their fitness goals, whether it's weight loss, muscle gain, or overall health improvement.",
            instagram: "#", 
            facebook: "#",
            twitter: "#",
        },
        {
            name: "Andilaman Omar",
            role: "Cardio Specialist",
            image:'https://images.unsplash.com/photo-1704223523169-52feeed90365?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBlcnNvbmFsJTIwdHJhaW5lcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
            bio: "Omar is a cardio specialist with a focus on high-intensity interval training (HIIT) and endurance workouts. He helps clients improve their cardiovascular fitness and achieve their weight loss goals.",
            instagram: "#",
            facebook: "#",
            twitter: "#",
        },
    ];
  return (
    <div id="trainers" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Expert Trainers
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg ">
            {" "}
            Our certified professionals are here to help you achieve your
            fitness goals
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* map method */}
          {trainers.map((trainer, index) => {
            return (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-72 overflow-hidden">
              <img
                src={trainer.image}
                alt={trainer.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-1 text-gray-800">
                {trainer.name}
              </h3>
              <div className="text-red-600 font-medium mb-2">{trainer.role}</div>
              <p className="text-gray-600 mb-4">{trainer.bio}</p>
              <div className="flex justify-center space-x-4 mb-4">
                <a
                  href=""
                  className="text-gray-400 hover:text-red-600 transition duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-instagram"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                </a>
                <a
                  href=""
                  className="text-gray-400 hover:text-red-600 transition duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-facebook"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                  </svg>
                </a>

                <a
                  href=""
                  className="text-gray-400 hover:text-red-600 transition duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-twitter-x"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                  </svg>
                </a>
              </div>
              <div className="text-center">
                <button 
                  onClick={() => {
                    setSelectedTrainer(trainer);
                    setIsModalOpen(true);
                  }}
                  className="inline-block border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-md font-medium transition duration-300"
                >
                  Book a Training session
                </button>
              </div>
            </div>
          </div>
              );
            })}
        </div>
      </div>

      {/* Booking Modal */}
      <TrainerBookingModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTrainer(null);
        }}
        trainer={selectedTrainer}
      />
    </div>
  );
}

export default Trainers;
