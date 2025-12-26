// UserDetail.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Text,
  Image,
  Stack,
  Group,
  Button,
  Center,
  Loader,
  Box,
} from '@mantine/core';
import { fetchUserById } from '../API';
import type { User } from '../types';
import avatarka from '../assets/images/ava1.png';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => fetchUserById(Number(id)),
    staleTime: 300000,
  });

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="xl" color="green" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Center h="100vh">
        <Text>User not found</Text>
      </Center>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" withBorder>
        <Stack gap="lg">
          <Center>
            <Image src={avatarka} alt="Avatar" w={150} h={150} radius="xl" />
          </Center>

          <Box>
            <Text size="xl" fw={700} ta="center" c="green">
              {user.firstName} {user.lastName}
            </Text>
            <Text size="md" c="dimmed" ta="center">
            Nick:  @{user.username}
            </Text>
          </Box>

          <Stack gap="xs">
            <Group>
              <Text fw={600}>Email:</Text>
              <Text>{user.email}</Text>
            </Group>
            <Group>
              <Text fw={600}>Phone:</Text>
              <Text>{user.phone}</Text>
            </Group>
            <Group>
              <Text fw={600}>Website:</Text>
              <Text>{user.website}</Text>
            </Group>
            <Group>
              <Text fw={600}>Address:</Text>
              <Text>
                {user.address.street}, {user.address.city}
              </Text>
            </Group>
            <Group>
              <Text fw={600}>Company:</Text>
              <Text>{user.company.name}</Text>
            </Group>
          </Stack>

          <Button color="green" fullWidth onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default UserDetail;