'use client'

import { useEffect, useState } from "react";
import { Character } from "./page";

interface Planet {
	name: string;
}

interface Movie {
	title: string;
}

const fetchPlanet = async (url: string) => {
	const response = await fetch(url);
	return response.json();
};

const fetchMovies = async (urls: string[]) => {
	const movieRequests = urls.map((url) => fetch(url).then((response) => response.json()));
	return Promise.all(movieRequests);
};

const CharacterModal: React.FC<{ character: Character | null; onClose: () => void }> = ({
	character,
	onClose,
}) => {
	const [homeworld, setHomeworld] = useState<Planet | null>(null);
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchHomeworld = async () => {
			if (character && character.homeworld) {
				const planet = await fetchPlanet(character.homeworld);
				setHomeworld(planet);
			}
		};

		const fetchCharacterMovies = async () => {
			if (character && character.films.length > 0) {
				try {
					setLoading(true);
					const moviesData = await fetchMovies(character.films);
					setMovies(moviesData);
				} finally {
					setLoading(false);
				}
			}
		};

		fetchHomeworld();
		fetchCharacterMovies();
	}, [character]);

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white">
			<div className="bg-gray-800 p-4 rounded-md shadow-md w-2/3">
				{loading ? (
					<div className="text-center">
						<div role="status">
							<svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
							</svg>
							<span className="sr-only">Loading...</span>
						</div>
					</div>
				) : (
					<>
						{character ? (
							<>
								<h2 className="text-2xl font-semibold mb-2">{character.name}</h2>
								<p>Gender: {character.gender}</p>
								<p>Birth Year: {character.birth_year}</p>
								<p>Hair Color: {character.hair_color}</p>
								<p>Height: {character.height} cm</p>
								<p>Mass: {character.mass} kg</p>
								<p>Skin Color: {character.skin_color}</p>
								{homeworld && <p>Homeworld: {homeworld.name}</p>}
								{movies.length > 0 && (
									<>
										<p className="mt-2 font-semibold">Movies:</p>
										<ul className="list-disc pl-5">
											{movies.map((movie: Movie) => (
												<li key={movie.title}>{movie.title}</li>
											))}
										</ul>
									</>
								)}
							</>
						) : (
							<p>No character selected</p>
						)}
					</>
				)}
				<button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md">
					Close
				</button>
			</div>
		</div>
	);
};

export default CharacterModal;