// HomePage.tsx 
import React, { useState, useMemo } from 'react';
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
import avatarka from '../assets/images/ava01.jpg';
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

  const users = data?.users ?? [];

  const filtered = useMemo(() => {
    return users.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [users, query]);

  const total = Math.ceil(filtered.length / 12);

  const items = useMemo(() => {
    return filtered.slice((page - 1) * 12, page * 12);
  }, [filtered, page]);

  const handleSearch = () => {
    setQuery(search);
    setPage(1);
  };

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="xl" color="green" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Paper p="lg" mb="lg">
        <Group justify="center">
          <Image src={logo} alt="logo" w={100} h={100} radius="xl" />
        </Group>
      </Paper>

      <Paper shadow="sm" p="md" mb="lg">
        <Group>
          <TextInput
            placeholder="Search users name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1 }}
          />
          <Button color="green" onClick={handleSearch}>
            Search
          </Button>
        </Group>
      </Paper>

      <Grid mb="lg">
        {items.map((user: User) => (
          <Grid.Col key={user.id} span={{ base: 12, sm: 6, md: 3 }}>
            <Card
              p="xl"
              withBorder
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/user/${user.id}`)}
              onKeyDown={(e) =>
                e.key === 'Enter' && navigate(`/user/${user.id}`)
              }
              style={{
                cursor: 'pointer',
                borderColor: 'var(--mantine-color-green-5)',
                transition: '0.2s',
              }}
            >
              <Stack gap="md">
                <Center>
                  <Image src={avatarka} alt="Avatar" w={80} h={80} radius="xl" />
                </Center>
                <Box>
                  <Text component="h2" size="lg" fw={600} ta="center" c="green">
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text size="sm" c="dimmed" ta="center">
                    Nick: @{user.username}
                  </Text>
                </Box>
                <Stack gap={6}>
                  <Text size="sm">Email: {user.email}</Text>
                  <Text size="sm" c="dimmed">
                    Number: {user.phone}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Address: {user.address.city}
                  </Text>
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {total > 1 && (
        <Center mt="xl">
          <Pagination value={page} onChange={setPage} total={total} color="green" />
        </Center>
      )}
    </Container>
  );
};

export default HomePage;