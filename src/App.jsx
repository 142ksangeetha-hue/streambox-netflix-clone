import { useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";


/* =====================================================
   MOVIE DATA
===================================================== */

const movies = [
  {
    id: 1,
    title: "The Last Journey",
    category: "Adventure",
    year: 2026,
    rating: "8.4",
    age: "16+",
    description:
      "An unforgettable journey beyond the unknown. A group of explorers must face their greatest challenge.",
    image: "/movies/movie1.jpg",
  },
  {
    id: 2,
    title: "Midnight City",
    category: "Thriller",
    year: 2025,
    rating: "8.1",
    age: "16+",
    description:
      "A mysterious story that unfolds after dark when a detective discovers a dangerous secret.",
    image: "/movies/movie2.jpg",
  },
  {
    id: 3,
    title: "Beyond Tomorrow",
    category: "Science Fiction",
    year: 2026,
    rating: "8.7",
    age: "13+",
    description:
      "A new world. A new beginning. Humanity searches for a future beyond Earth.",
    image: "/movies/movie3.jpg",
  },
  {
    id: 4,
    title: "Hidden Secrets",
    category: "Mystery",
    year: 2024,
    rating: "7.9",
    age: "16+",
    description:
      "Everyone has something to hide. One discovery changes everything.",
    image: "/movies/movie4.jpg",
  },
  {
    id: 5,
    title: "Love Again",
    category: "Romance",
    year: 2025,
    rating: "8.2",
    age: "13+",
    description:
      "Sometimes love finds its way back when you least expect it.",
    image: "/movies/movie5.jpg",
  },
  {
    id: 6,
    title: "Final Mission",
    category: "Action",
    year: 2026,
    rating: "8.6",
    age: "18+",
    description:
      "One mission. One chance to survive. An elite team enters enemy territory.",
    image: "/movies/movie6.jpg",
  },
  {
    id: 7,
    title: "Ocean Storm",
    category: "Action",
    year: 2025,
    rating: "7.8",
    age: "13+",
    description:
      "A crew battles the most dangerous storm of their lives.",
    image: "/movies/movie7.jpg",
  },
  {
    id: 8,
    title: "Lost Memories",
    category: "Drama",
    year: 2024,
    rating: "8.3",
    age: "13+",
    description:
      "A forgotten past slowly returns and changes everything.",
    image: "/movies/movie8.jpg",
  },
  {
    id: 9,
    title: "The Detective",
    category: "Mystery",
    year: 2025,
    rating: "8.5",
    age: "16+",
    description:
      "A brilliant detective follows a trail that leads somewhere unexpected.",
    image: "/movies/movie9.jpg",
  },
];


/* =====================================================
   APP
===================================================== */

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/watch/:id" element={<WatchMovie />} />
      <Route path="/my-list" element={<MyList />} />
    </Routes>
  );
}


/* =====================================================
   LOGIN
===================================================== */

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:5050/api/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("streamboxUser", email);

      navigate("/dashboard");

    } catch (err) {
      setError(
        "Unable to connect to the server. Make sure your backend is running."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">

      <header className="login-header">
        <div className="logo">
          STREAMBOX
        </div>
      </header>


      <div className="login-container">

        <form
          className="login-card"
          onSubmit={handleLogin}
        >

          <h1>
            Sign In
          </h1>


          {error && (
            <div className="error-message">
              {error}
            </div>
          )}


          <div className="input-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>


          <div className="input-group">

            <label>
              Password
            </label>

            <div className="password-container">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>


          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>


          <div className="demo-login">

            <strong>
              Demo Login
            </strong>

            <p>
              Email: demo@example.com
            </p>

            <p>
              Password: Demo@123
            </p>

          </div>

        </form>

      </div>

    </div>
  );
}


/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [mobileMenu, setMobileMenu] = useState(false);

  const [myList, setMyList] = useState(
    JSON.parse(
      localStorage.getItem("streamboxMyList") || "[]"
    )
  );


  const addToList = (movie) => {

    const exists = myList.some(
      (item) => item.id === movie.id
    );

    if (exists) {
      return;
    }

    const updated = [...myList, movie];

    setMyList(updated);

    localStorage.setItem(
      "streamboxMyList",
      JSON.stringify(updated)
    );
  };


  const filteredMovies = movies.filter((movie) => {

    const text =
      `${movie.title} ${movie.category}`.toLowerCase();

    return text.includes(search.toLowerCase());

  });


  const scrollToContent = () => {

    document
      .getElementById("content-section")
      ?.scrollIntoView({
        behavior: "smooth",
      });

  };


  const logout = () => {

    localStorage.removeItem("streamboxUser");

    navigate("/");

  };


  return (
    <div className="dashboard">


      {/* HEADER */}

      <header className="dashboard-header">

        <div
          className="logo"
          onClick={() => navigate("/dashboard")}
        >
          STREAMBOX
        </div>


        <nav className="desktop-nav">

          <button onClick={scrollToContent}>
            Home
          </button>

          <button onClick={scrollToContent}>
            Movies
          </button>

          <button onClick={scrollToContent}>
            Series
          </button>

          <button onClick={() => navigate("/my-list")}>
            My List
          </button>

        </nav>


        {/* SEARCH */}

        <div className="header-right">

          <div className="search-box">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="profile">

            <button className="profile-button">
              👤
            </button>

            <div className="profile-menu">

              <p>
                {localStorage.getItem(
                  "streamboxUser"
                ) || "Demo User"}
              </p>

              <button
                onClick={() => navigate("/my-list")}
              >
                ❤️ My List
              </button>

              <button onClick={logout}>
                🚪 Sign Out
              </button>

            </div>

          </div>


          {/* MOBILE MENU */}

          <button
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
          >
            ☰
          </button>

        </div>

      </header>


      {mobileMenu && (

        <div className="mobile-menu">

          <button onClick={scrollToContent}>
            Home
          </button>

          <button onClick={scrollToContent}>
            Movies
          </button>

          <button onClick={scrollToContent}>
            Series
          </button>

          <button
            onClick={() =>
              navigate("/my-list")
            }
          >
            ❤️ My List
          </button>

          <button onClick={logout}>
            Sign Out
          </button>

        </div>

      )}


      {/* HERO */}

      <section className="hero-section">

        <div className="hero-content">

          <p className="small-title">
            STREAMBOX ORIGINAL
          </p>

          <h1>
            Your next favorite
            <span>
              story starts here.
            </span>
          </h1>

          <p className="dashboard-description">
            Discover movies, series and unforgettable
            entertainment made for every mood.
          </p>


          <div className="hero-buttons">

            <button
              className="browse-button"
              onClick={scrollToContent}
            >
              ▶ Browse Content
            </button>

            <button
              className="more-button"
              onClick={() =>
                navigate("/movie/1")
              }
            >
              More Info
            </button>

          </div>

        </div>

      </section>


      {/* CONTENT */}

      <main
        id="content-section"
        className="content-section"
      >

        <div className="section-heading">

          <div>

            <p className="small-title">
              DISCOVER
            </p>

            <h2>
              {search
                ? `Search results for "${search}"`
                : "Explore Content"}
            </h2>

          </div>

        </div>


        {/* TRENDING */}

        {!search && (

          <section className="movie-section">

            <h2>
              🔥 Trending Now
            </h2>

            <div className="movie-grid">

              {movies
                .slice(0, 6)
                .map((movie) => (

                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    addToList={addToList}
                  />

                ))}

            </div>

          </section>

        )}


        {/* SEARCH RESULTS */}

        {search && (

          <div className="movie-grid">

            {filteredMovies.length > 0 ? (

              filteredMovies.map((movie) => (

                <MovieCard
                  key={movie.id}
                  movie={movie}
                  addToList={addToList}
                />

              ))

            ) : (

              <p className="no-results">
                No movies found.
              </p>

            )}

          </div>

        )}


        {/* CATEGORIES */}

        {!search && (

          <>

            <MovieCategory
              title="🔥 Action"
              category="Action"
              addToList={addToList}
            />

            <MovieCategory
              title="💖 Romance"
              category="Romance"
              addToList={addToList}
            />

            <MovieCategory
              title="🕵 Mystery"
              category="Mystery"
              addToList={addToList}
            />

            <MovieCategory
              title="🚀 Science Fiction"
              category="Science Fiction"
              addToList={addToList}
            />

          </>

        )}

      </main>

    </div>
  );
}


/* =====================================================
   MOVIE CATEGORY
===================================================== */

function MovieCategory({
  title,
  category,
  addToList,
}) {

  const categoryMovies = movies.filter(
    (movie) =>
      movie.category === category
  );

  if (categoryMovies.length === 0) {
    return null;
  }

  return (

    <section className="movie-section">

      <h2>
        {title}
      </h2>

      <div className="movie-grid">

        {categoryMovies.map((movie) => (

          <MovieCard
            key={movie.id}
            movie={movie}
            addToList={addToList}
          />

        ))}

      </div>

    </section>

  );
}


/* =====================================================
   MOVIE CARD
===================================================== */

function MovieCard({
  movie,
  addToList,
}) {

  const navigate = useNavigate();


  return (

    <article className="movie-card">


      <div
        className="movie-image"
        onClick={() =>
          navigate(`/movie/${movie.id}`)
        }
      >

        <img
          src={movie.image}
          alt={movie.title}
        />

        <div className="movie-overlay">

          <button
            className="play-circle"
            onClick={(e) => {
              e.stopPropagation();

              navigate(`/watch/${movie.id}`);
            }}
          >
            ▶
          </button>

        </div>

      </div>


      <div className="movie-details">

        <p className="movie-category">
          {movie.category}
        </p>

        <h3>
          {movie.title}
        </h3>


        <div className="movie-meta">

          <span>
            ⭐ {movie.rating}
          </span>

          <span>
            {movie.year}
          </span>

          <span>
            {movie.age}
          </span>

        </div>


        <p className="movie-description">
          {movie.description}
        </p>


        <div className="movie-actions">

          <button
            className="watch-button"
            onClick={() =>
              navigate(`/watch/${movie.id}`)
            }
          >
            ▶ Play
          </button>

          <button
            className="list-button"
            onClick={() =>
              addToList(movie)
            }
          >
            + My List
          </button>

        </div>

      </div>

    </article>

  );
}


/* =====================================================
   MOVIE DETAILS
===================================================== */

function MovieDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const movie = movies.find(
    (item) => item.id === Number(id)
  );


  if (!movie) {

    return (
      <div className="not-found">
        <h1>Movie not found</h1>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back to Dashboard
        </button>
      </div>
    );

  }


  return (

    <div className="details-page">


      <button
        className="back-button"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        ← Back
      </button>


      <div
        className="details-hero"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              #050505 10%,
              rgba(5,5,5,0.8) 45%,
              rgba(5,5,5,0.2)
            ),
            url(${movie.image})
          `,
        }}
      >

        <div className="details-content">

          <p className="small-title">
            STREAMBOX ORIGINAL
          </p>

          <h1>
            {movie.title}
          </h1>


          <div className="large-meta">

            ⭐ {movie.rating}

            <span>
              {movie.year}
            </span>

            <span>
              {movie.age}
            </span>

            <span>
              {movie.category}
            </span>

          </div>


          <p>
            {movie.description}
          </p>


          <div className="hero-buttons">

            <button
              className="browse-button"
              onClick={() =>
                navigate(`/watch/${movie.id}`)
              }
            >
              ▶ Play Now
            </button>

            <button
              className="more-button"
              onClick={() =>
                navigate("/my-list")
              }
            >
              + My List
            </button>

          </div>

        </div>

      </div>


      <section className="more-like-this">

        <h2>
          More Like This
        </h2>

        <div className="movie-grid">

          {movies
            .filter(
              (item) =>
                item.category === movie.category &&
                item.id !== movie.id
            )
            .map((item) => (

              <MovieCard
                key={item.id}
                movie={item}
                addToList={() => {}}
              />

            ))}

        </div>

      </section>

    </div>

  );
}


/* =====================================================
   WATCH MOVIE
===================================================== */

function WatchMovie() {

  const { id } = useParams();

  const navigate = useNavigate();

  const movie = movies.find(
    (item) => item.id === Number(id)
  );


  if (!movie) {
    return null;
  }


  return (

    <div className="watch-page">

      <button
        className="watch-back"
        onClick={() =>
          navigate(`/movie/${movie.id}`)
        }
      >
        ← Back
      </button>


      <div className="video-container">

        <div className="video-placeholder">

          <div className="big-play">
            ▶
          </div>

          <p>
            Video Player
          </p>

          <small>
            Demo video area for {movie.title}
          </small>

        </div>

      </div>


      <div className="watch-info">

        <h1>
          {movie.title}
        </h1>

        <p>
          ⭐ {movie.rating} &nbsp; • &nbsp;
          {movie.year} &nbsp; • &nbsp;
          {movie.category}
        </p>

      </div>

    </div>

  );
}


/* =====================================================
   MY LIST
===================================================== */

function MyList() {

  const navigate = useNavigate();

  const [list, setList] = useState(
    JSON.parse(
      localStorage.getItem("streamboxMyList") || "[]"
    )
  );


  const removeMovie = (id) => {

    const updated = list.filter(
      (movie) => movie.id !== id
    );

    setList(updated);

    localStorage.setItem(
      "streamboxMyList",
      JSON.stringify(updated)
    );

  };


  return (

    <div className="my-list-page">

      <header className="simple-header">

        <div
          className="logo"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          STREAMBOX
        </div>

        <button
          className="back-dashboard"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>

      </header>


      <main className="my-list-content">

        <p className="small-title">
          YOUR COLLECTION
        </p>

        <h1>
          My List
        </h1>


        {list.length === 0 ? (

          <div className="empty-list">

            <h2>
              Your list is empty
            </h2>

            <p>
              Add movies you want to watch later.
            </p>

            <button
              className="browse-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Browse Movies
            </button>

          </div>

        ) : (

          <div className="movie-grid">

            {list.map((movie) => (

              <article
                className="movie-card"
                key={movie.id}
              >

                <div
                  className="movie-image"
                  onClick={() =>
                    navigate(`/movie/${movie.id}`)
                  }
                >

                  <img
                    src={movie.image}
                    alt={movie.title}
                  />

                </div>


                <div className="movie-details">

                  <h3>
                    {movie.title}
                  </h3>

                  <p>
                    ⭐ {movie.rating} • {movie.year}
                  </p>

                  <button
                    className="remove-button"
                    onClick={() =>
                      removeMovie(movie.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </main>

    </div>

  );
}


export default App;