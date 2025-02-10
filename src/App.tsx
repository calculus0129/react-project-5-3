import { useRef, useState, useEffect } from "react";
// import "./App.css";
import logoImg from "./assets/logo.png";
import { AVAILABLE_PLACES, Place } from "./data";
import Modal, { ResultModalHandle } from "./components/Model";
import DeleteConfirmation from "./components/DeleteConfirmation";
import Places from "./components/Places";
import { sortPlacesByDistance } from "./loc";

function App() {
  const modal = useRef<ResultModalHandle | null>(null);
  const selectedPlace = useRef<string | null>(null);
  const [pickedPlaces, setPickedPlaces] = useState<Place[]>([]);
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
  }, [sortedAvailablePlaces]);

  const handleStartRemovePlace = (id: string) => {
    modal.current?.open();
    selectedPlace.current = id;
  };

  const handleSelectPlace = (id: string) => {
    setPickedPlaces((places) => {
      if (!places.some((place) => place.id === id)) {
        const newPlace = AVAILABLE_PLACES.find((place) => place.id === id);
        if (newPlace) {
          return [newPlace, ...places];
        }
      }
      return places;
    });
  };

  return (
    <>
      <Modal ref={modal}>
        <DeleteConfirmation
          onCancel={() => modal.current?.close()}
          onConfirm={() => {
            if (selectedPlace.current) {
              setPickedPlaces((places) =>
                places.filter((place) => place.id !== selectedPlace.current),
              );
            }
            modal.current?.close();
          }}
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
