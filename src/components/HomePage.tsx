import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  Text,
  TextInput,
  Pagination,
  Center,
  Loader,
  Stack,
  Paper,
  Image,
  Box,
  Group,
  Button,
} from '@mantine/core';
import { fetchUsers } from '../API';
import type { UsersResponse, User } from '../types';
import avatarka from '../assets/images/avatarka.jpg';
import logo from '../assets/images/logo.png';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 300000,
  });

  const users = data?.users || [];
  const filtered = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(query.toLowerCase())
  );

  const total = Math.ceil(filtered.length / 12);
  const items = filtered.slice((page - 1) * 12, page * 12);

  const handleSearch = () => {
    setQuery(search);
    setPage(1);
  };

  if (isLoading) return <Center h="100vh"><Loader size="xl" color="green" /></Center>;

  return (
    <Container size="xl" py="xl">
     <Paper shadow="sm" p="lg" mb="lg">
  <Group justify="center" >
    <Image src={logo} alt="logo" w={100} h={100} radius="xl" />
  </Group>
</Paper>

      <Paper shadow="sm" p="md" mb="lg">
        <Group>
          <TextInput
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1 }}
          />
          <Button color="green" onClick={handleSearch}>Search</Button>
        </Group>
      </Paper>

      <Grid mb="lg">
        {items.map((user: User) => (
          <Grid.Col key={user.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" p="lg" withBorder onClick={() => navigate(`/user/${user.id}`)} 
              style={{ cursor: 'pointer' }}>
              <Stack gap="md">
                <Center>
                  <Image src={avatarka} alt="Avatar" w={80} h={80} radius="xl" />
                </Center>
                <Box>
                  <Text component="h2" size="lg" fw={600} ta="center" c="green">
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text size="sm" c="dimmed" ta="center">@{user.username}</Text>
                </Box>
                <Stack gap={6}>
                  <Text size="sm">{user.email}</Text>
                  <Text size="sm" c="dimmed">{user.phone}</Text>
                  <Text size="sm" c="dimmed">{user.address.city}</Text>
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {total > 1 && (
        <Center>
          <Pagination value={page} onChange={setPage} total={total} color="green" />
        </Center>
      )}
    </Container>
  );
};

export default HomePage;