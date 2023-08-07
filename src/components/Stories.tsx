import { useState } from "react";
import "../css/stories.css";

const Stories = () => {
  const [stories] = useState([
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
      name: "John Will",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
      name: "Alan Lee",
    },
    {
      id: 3,
      image:
        "https://wpdaddy.com/wp-content/uploads/2020/11/thispersondoesnotexist.jpg",
      name: "Steve Finn",
    },
    {
      id: 4,
      image: "https://pbs.twimg.com/media/DZotU1hW0AEDN5F.jpg:large",
      name: "Jacob Roy",
    },
    {
      id: 5,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDgW5gszwRbA7UhgEXksv_SEPoonCC6JLxaw&usqp=CAU",
      name: "Leena",
    },
    {
      id: 6,
      image:
        "https://static.generated.photos/vue-static/face-generator/landing/wall/20.jpg",
      name: "Darren",
    },

    {
      id: 7,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0S19FU9JgywqaYQqTDmnm3k_r_HbfaA1g6A&usqp=CAU",
      name: "Mini Smith",
    },
    { id: 8, image: "https://i.redd.it/k5agwo7d9k371.png", name: "Twinkle" },
    {
      id: 9,
      image:
        "https://i1.wp.com/superlucky.me/wp-content/uploads/2017/11/2017_newphoto_avatar.jpg?fit=1200%2C1155&ssl=1",
      name: "Alia Roy",
    },
    {
      id: 10,
      image:
        "https://img.freepik.com/free-photo/mand-holding-cup_1258-340.jpg?size=626&ext=jpg",
      name: "Alia Roy",
    },
  ]);
  return (
    <div className="stories">
      {stories.map((story) => (
        <div className="stories__info" key={story.id}>
          <div className="stories__img">
            <span>
              <img src={story.image} alt={story.name} />
            </span>
          </div>
          <div className="stories__name">{story.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Stories;
