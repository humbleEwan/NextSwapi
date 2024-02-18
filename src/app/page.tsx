'use client'

import React, { useState, useEffect } from 'react';
import CharacterModal from './modal';

export interface Character {
	name: string;
	gender: string;
	birth_year: string;
	hair_color: string;
	height: string;
	mass: string;
	skin_color: string;
	homeworld: string;
	films: string[];
}

const fetchCharacters = async (page: number) => {
	const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
	return response.json();
};

const Home: React.FC = () => {
	const [characters, setCharacters] = useState<Character[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasNextPage, setHasNextPage] = useState(false);
	const [hasPreviousPage, setHasPreviousPage] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				setCharacters([]);
				const data = await fetchCharacters(currentPage);
				setCharacters(data.results);
				setHasNextPage(!!data.next);
				setHasPreviousPage(!!data.previous);
			} catch (error) {
				console.error('Error fetching characters:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [currentPage]);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const openModal = async (character: Character) => {
		setSelectedCharacter(character);
	};

	const closeModal = () => {
		setSelectedCharacter(null);
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-4">Star Wars Characters</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{characters.map((character: Character) => (
					<div
						key={character.name}
						className="bg-gray-700 p-4 rounded-md shadow-md transition-transform duration-300 transform hover:scale-105 hover:bg-gray-600 cursor-pointer select-none"
						onClick={() => openModal(character)}
					>
						<h2 className="text-xl font-semibold mb-2 text-white">{character.name}</h2>
						<img
							className="mt-4 mx-auto h-24 w-24 object-cover rounded-full"
							src={`https://via.placeholder.com/150?text=${character.name}`}
							alt={`${character.name} image`}
						/>
					</div>
				))}
			</div>
			<div className="mt-4">
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={!hasPreviousPage || isLoading}
					className="mr-2 px-4 py-2 bg-gray-700 text-white rounded-md disabled:bg-gray-900 disabled:text-gray-400"
				>
					Previous
				</button>
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={!hasNextPage || isLoading}
					className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:bg-gray-900 disabled:text-gray-400"
				>
					Next
				</button>
			</div>
			{selectedCharacter && (
				<CharacterModal character={selectedCharacter} onClose={closeModal} />
			)}
		</div>
	);
};

export default Home;