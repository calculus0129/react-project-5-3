import { useRef, useState, useEffect, useCallback } from "react";
// import "./App.css";
import logoImg from "./assets/logo.png";
import { AVAILABLE_PLACES, Place } from "./data";
import Modal from "./components/Model";
import DeleteConfirmation from "./components/DeleteConfirmation";
import Places from "./components/Places";
import { sortPlacesByDistance } from "./loc";

// This shows up when the app is loaded. (e.g. when the page is refreshed)
// When the code is parsed and executed for the first time.
console.log("pickedPlaceIds:", localStorage.getItem("pickedPlaceIds"));

function App() {
  // const modal = useRef<ResultModalHandle | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const selectedPlace = useRef<string | null>(null);
  // console.log("pickedPlaceIds:", localStorage.getItem("pickedPlaceIds")); // This shows up the early state of the picked places.
  // Why? Because the `localStorage.getItem` is synchronous and the `useState` is asynchronous.
  const [pickedPlaces, setPickedPlaces] = useState<Place[]>(
    JSON.parse(localStorage.getItem("pickedPlaceIds") || "[]")
      .map((id: string): Place | undefined => AVAILABLE_PLACES.find((place) => place.id === id))
      .filter((place: Place | undefined) => place !== undefined),
  );
  const [sortedAvailablePlaces, setSortedAvailablePlaces] = useState(AVAILABLE_PLACES);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        setSortedAvailablePlaces(
          sortPlacesByDistance(
            AVAILABLE_PLACES,
            position.coords.latitude,
            position.coords.longitude,
          ),
        );
      },
      (error) => {
        console.error(error);
      },
    );
  }, []); // We should not put the `sortedAvailablePlaces` in the dependency array
  // as it will cause an infinite loop of re-rendering.

  const handleStartRemovePlace = (id: string) => {
    setModalOpen(true);
    selectedPlace.current = id;
  };

  const handleSelectPlace = (id: string) => {
    setPickedPlaces((places) => {
      if (!places.some((place) => place.id === id)) {
        const newPlace = AVAILABLE_PLACES.find((place) => place.id === id);
        if (newPlace) {
          const newPlaces = [...places, newPlace];
          localStorage.setItem(
            "pickedPlaceIds",
            JSON.stringify(newPlaces.map((place) => place.id)),
          );
          return newPlaces;
        }
      }
      return places;
    });
  };

  return (
    <>
      <Modal modalOpen={modalOpen}>
        <DeleteConfirmation
          onCancel={() => setModalOpen(false)}
          onConfirm={useCallback(() => {
            if (selectedPlace.current) {
              setPickedPlaces((places) => {
                const newPlaces = places.filter((place) => place.id !== selectedPlace.current);
                localStorage.setItem(
                  "pickedPlaceIds",
                  JSON.stringify(newPlaces.map((place) => place.id)),
                );
                return newPlaces;
              });
            }
            setModalOpen(false);
          }, [])}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          fallbackText={"Sorting places by distance ..."}
          places={sortedAvailablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
