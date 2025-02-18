import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:3000/api/user-set-collections';

// Query Keys als Konstanten definieren
export const setCollectionKeys = {
  all: ['setCollections'],
  single: (id) => ['setCollections', id],
};

// Alle Sets abrufen
export const fetchUserSetCollections = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

// Neuen Set-Eintrag anlegen
export const createUserSetCollection = async (newSet) => {
  const { data } = await axios.post(API_URL, newSet, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

// Set mit ID abrufen
export const fetchUserSetCollection = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

// Set aktualisieren
export const updateUserSetCollection = async ({ id, ...updates }) => {
  const { data } = await axios.put(`${API_URL}/${id}`, updates, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

// Set löschen
export const deleteUserSetCollection = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);
  return data;
};

// Custom Hooks mit v5 Syntax
export const useUserSetCollections = () => {
  return useQuery({
    queryKey: setCollectionKeys.all,
    queryFn: fetchUserSetCollections
  });
};

export const useUserSetCollection = (id) => {
  return useQuery({
    queryKey: setCollectionKeys.single(id),
    queryFn: () => fetchUserSetCollection(id),
    enabled: !!id
  });
};

export const useCreateUserSetCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUserSetCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: setCollectionKeys.all });
    }
  });
};

export const useUpdateUserSetCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserSetCollection,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: setCollectionKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: setCollectionKeys.single(variables.id) 
      });
    }
  });
};

export const useDeleteUserSetCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserSetCollection,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: setCollectionKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: setCollectionKeys.single(id) 
      });
    }
  });
};