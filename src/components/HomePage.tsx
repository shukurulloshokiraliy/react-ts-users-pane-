import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Grid,
  Card,
  Text,
  Group,
  Badge,
  Select,
  TextInput,
  Pagination,
  Center,
  Loader,
  Alert,
  Stack,
  Paper,
  Avatar,
  Box,
  Image,
} from '@mantine/core';
import { IconSearch, IconUsers, IconFilter, IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';
import { fetchUsers } from '../API';
import type { UsersResponse, User } from '../types';
import logo from '../assets/images/logo.png';

interface HomePageProps {
  onUserSelect: (userId: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string | null>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data, isLoading, error } = useQuery<UsersResponse>({
    queryKey: ['users'],
    queryFn: () => fetchUsers(100, 0),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  });

  const filtered = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter((user: User) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase());
      const matchesGender = genderFilter === 'all' || user.gender === genderFilter;
      return matchesSearch && matchesGender;
    });
  }, [data?.users, searchTerm, genderFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedUsers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Center h="70vh">
          <Stack align="center" gap="md">
            <Loader size="xl" color="blue" />
            <Text c="dimmed">Yuklanmoqda...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert color="blue" title="Xatolik!">
          {error instanceof Error ? error.message : 'Xatolik yuz berdi'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Paper shadow="sm" p="lg" mb="lg" radius="md">
        <Group justify="space-between">
          <Group gap="sm">
            <Image src={logo} alt="Logo" w={55} h={55} fit="contain" />
            <Box>
              <Text size="lg" fw={700} c="blue">Users</Text>
              <Text size="xs" c="dimmed">List of all users</Text>
            </Box>
          </Group>
          <Badge size="lg" color="blue" variant="filled">
            <Group gap={4}>
              <IconUsers size={14} />
              {data?.total || 0}
            </Group>
          </Badge>
        </Group>
      </Paper>

      <Paper shadow="sm" p="md" mb="lg" radius="md">
        <Group gap="md">
          <TextInput
            label="Qidirish"
            placeholder="Ism yoki familiya..."
            leftSection={<IconSearch size={14} />}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            flex={1}
            radius="md"
            size="sm"
          />
          <Select
            label="Filter"
            placeholder="Tanlang"
            leftSection={<IconFilter size={14} />}
            data={[
              { value: 'all', label: 'Barcha' },
              { value: 'male', label: 'Erkaklar' },
              { value: 'female', label: 'Ayollar' },
            ]}
            value={genderFilter}
            onChange={(value) => {
              setGenderFilter(value);
              setCurrentPage(1);
            }}
            w={140}
            radius="md"
            size="sm"
          />
        </Group>
        {(searchTerm || genderFilter !== 'all') && (
          <Text size="xs" c="dimmed" mt="xs">
            {filtered.length} ta natija
          </Text>
        )}
      </Paper>

      <Grid gutter="md" mb="lg">
        {paginatedUsers.length > 0 ? (
          paginatedUsers.map((user: User) => (
            <Grid.Col key={user.id} span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
              <Card
                shadow="sm"
                p="md"
                radius="md"
                withBorder
                onClick={() => onUserSelect(user.id)}
                style={{ cursor: 'pointer', height: '100%' }}
              >
                <Stack gap="sm">
                  <Center>
                    <Avatar size={70} radius="xl" color="blue" variant="filled">
                      <Text size="lg" fw={600}>
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </Text>
                    </Avatar>
                  </Center>

                  <Box>
                    <Text fw={600} size="sm" ta="center" c="blue" lineClamp={1}>
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text size="xs" c="dimmed" ta="center" lineClamp={1}>
                      @{user.username}
                    </Text>
                  </Box>

                  <Group justify="center" gap={4}>
                    <Badge color="blue" size="xs">{user.age}</Badge>
                    <Badge color={user.gender === 'male' ? 'blue' : 'pink'} variant="dot" size="xs">
                      {user.gender === 'male' ? 'Erkak' : 'Ayol'}
                    </Badge>
                  </Group>

                  <Stack gap={4}>
                    <Group gap={4} wrap="nowrap">
                      <IconMail size={14} />
                      <Text size="xs" lineClamp={1}>{user.email}</Text>
                    </Group>
                    <Group gap={4} wrap="nowrap">
                      <IconPhone size={14} />
                      <Text size="xs" lineClamp={1}>{user.phone}</Text>
                    </Group>
                    <Group gap={4} wrap="nowrap">
                      <IconMapPin size={14} />
                      <Text size="xs" lineClamp={1}>{user.address.city}</Text>
                    </Group>
                  </Stack>

                  <Badge color="blue" variant="light" size="xl" fullWidth>
                    Batafsil
                  </Badge>
                </Stack>
              </Card>
            </Grid.Col>
          ))
        ) : (
          <Grid.Col span={12}>
            <Center h={200}>
              <Stack align="center" gap="xs">
                <IconSearch size={40} stroke={1.5} />
                <Text size="sm" c="dimmed">Topilmadi</Text>
              </Stack>
            </Center>
          </Grid.Col>
        )}
      </Grid>

      {totalPages > 1 && (
        <Center>
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
            color="blue"
            size="md"
          />
        </Center>
      )}
    </Container>
  );
};

export default HomePage;