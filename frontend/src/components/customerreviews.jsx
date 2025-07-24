import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/customerReviews.css';
import {FaStar} from 'react-icons/fa';

const CustomerReviews = () => {
  const reviews = [
    {
      name: "Yash Mehta",
      text: "Great furniture quality and fast delivery.",
      image: '/images/cust1.jpg',
      rating: 5,
    },
    {
      name: "Isha Mehta",
      text: "Loved the designs and very comfortable.",
      image: '/images/cust3.jpg',
      rating: 4,
    },
    {
      name: "Aditi Mehta",
      text: "Highly recommended. Affordable and durable.",
      image: '/images/cust2.jpg',
      rating: 4,
    },
    {
      name: "Paul Hudson",
      text: "Highly recommended. Affordable and durable.",
      image: '/images/cust4.avif',
      rating: 3,
    }
  ];

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < count ? 'star filled' : 'star'}><FaStar/></span>
    ));
  };

  return (
    <div className="reviews-container">
      <h1>Customer Reviews</h1>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={3}
        loop={true}
        autoplay={{ delay: 3000 }}
        grabCursor={true}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div className="review-card">
              <img src={review.image} alt={review.name} />
              <div className="stars">{renderStars(review.rating)}</div>
              <p className="review-text">"{review.text}"</p>
              <p className="review-author">- {review.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CustomerReviews;
