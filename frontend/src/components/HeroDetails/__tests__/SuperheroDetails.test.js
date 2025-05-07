import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SuperheroDetails from '../SuperheroDetails';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Мокаємо axios
jest.mock('axios');

// Мокаємо useParams і useNavigate з react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ id: '1' }),
  useNavigate: jest.fn(),
}));

describe('SuperheroDetails', () => {
  const superheroMock = {
    _id: '1',
    nickname: 'Superman',
    real_name: 'Clark Kent',
    origin_description: 'Kryptonian',
    superpowers: 'Super strength, flight, x-ray vision',
    catch_phrase: 'Up, up and away!',
    images: ['https://example.com/superman.jpg']
  };

  test('renders superhero details correctly', async () => {
    // Мокаємо запит axios
    axios.get.mockResolvedValue({ data: superheroMock });

    render(
      <MemoryRouter initialEntries={['/superhero/1']}>
        <Routes>
          <Route path="/superhero/:id" element={<SuperheroDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Перевіряємо, що всі елементи супергероя правильно відображаються
    await waitFor(() => {
      expect(screen.getByText(/Superman/)).toBeInTheDocument();
      expect(screen.getByText(/Clark Kent/)).toBeInTheDocument();
      expect(screen.getByText(/Kryptonian/)).toBeInTheDocument();
      expect(screen.getByText(/Super strength/)).toBeInTheDocument();
      expect(screen.getByText(/Up, up and away!/)).toBeInTheDocument();
    });
  });

  // Інші тести залишаються без змін...
});
