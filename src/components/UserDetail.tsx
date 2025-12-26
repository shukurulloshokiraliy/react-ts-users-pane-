import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Text,
  Stack,
  Loader,
  Center,
  Button,
  Box,
  Image,
} from '@mantine/core';
import { fetchUserById } from '../API';
import type { User } from '../types';
import avatarka from '../assets/images/ava1.png';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user', Number(id)],
    queryFn: () => fetchUserById(Number(id)),
    staleTime: 300000,
  });

  if (isLoading) return <Center h="100vh"><Loader size="xl" color="green" /></Center>;
  if (!user) return <Center h="100vh"><Text>User not found</Text></Center>;

  return (
    <Container size="sm" py="xl">
      <Button color="green" onClick={() => navigate('/')} mb="lg">Back</Button>

      <Paper shadow="md" p="xl" radius="md" >
        <Stack gap="lg" align="center">
          <Image src={avatarka} alt="Avatar" w={100} h={100} radius="xl" bg="green" />
          
          <Box ta="center">
            <Text component="h1" size="xl" fw={700} c="green">
              {user.firstName} {user.lastName}
            </Text>
            <Text c="dimmed">@{user.username}</Text>
          </Box>

          <Stack gap="sm" w="100%">
            <Box>
              <Text size="xs" c="dimmed">Email</Text>
              <Text fw={500}>{user.email}</Text>
            </Box>

            <Box>
              <Text size="xs" c="dimmed">Phone</Text>
              <Text fw={500}>{user.phone}</Text>
            </Box>

            <Box>
              <Text size="xs" c="dimmed">City</Text>
              <Text fw={500}>{user.address.city}</Text>
            </Box>

            <Box>
              <Text size="xs" c="dimmed">Company</Text>
              <Text fw={500}>{user.company.name}</Text>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default UserDetail;