import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:3000/api/user-card-collections';

// Query Keys als Konstanten definieren
export const cardCollectionKeys = {
  all: ['cardCollections'],
  single: (id) => ['cardCollections', id],
};

// Alle Karten abrufen
export const fetchUserCardCollections = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

// Neue Karte anlegen
export const createUserCardCollection = async (newCard) => {
  const { data } = await axios.post(API_URL, newCard, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

// Karte mit ID abrufen
export const fetchUserCardCollection = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

// Karte aktualisieren
export const updateUserCardCollection = async ({ id, ...updates }) => {
  const { data } = await axios.put(`${API_URL}/${id}`, updates, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

// Karte löschen
export const deleteUserCardCollection = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};

// Custom Hooks mit v5 Syntax
export const useUserCardCollections = () => {
  return useQuery({
    queryKey: cardCollectionKeys.all,
    queryFn: fetchUserCardCollections
  });
};

export const useUserCardCollection = (id) => {
  return useQuery({
    queryKey: cardCollectionKeys.single(id),
    queryFn: () => fetchUserCardCollection(id),
    enabled: !!id
  });
};

export const useCreateUserCardCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUserCardCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cardCollectionKeys.all });
    }
  });
};