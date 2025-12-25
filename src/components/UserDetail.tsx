import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Paper,
  Text,
  Group,
  Stack,
  Badge,
  Loader,
  Alert,
  Grid,
  Card,
  Center,
  Button,
  Box,
  Avatar,
  ThemeIcon,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBriefcase,
  IconSchool,
  IconRuler,
  IconScale,
  IconEye,
  IconHeart,
  IconUser,
} from '@tabler/icons-react';
import { fetchUserById } from '../API';
import type { User } from '../types';

interface UserDetailProps {
  userId: number;
  onBack: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ userId, onBack }) => {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  });

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Center h="70vh">
          <Stack align="center" gap="md">
            <Loader size="xl" color="blue" />
            <Text c="dimmed">Yuklanmoqda...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container size="lg" py="xl">
        <Alert color="blue" title="Xatolik!">Ma'lumot topilmadi</Alert>
        <Button onClick={onBack} mt="md" color="blue">Orqaga</Button>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Button
        leftSection={<IconArrowLeft size={16} />}
        variant="light"
        color="blue"
        onClick={onBack}
        mb="lg"
        size="sm"
      >
        Orqaga
      </Button>

      <Paper shadow="md" p="xl" radius="md" mb="md">
        <Stack align="center" gap="md">
          <Avatar size={120} radius="xl" color="blue" variant="filled">
            <Text size="xl" fw={700}>
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </Text>
          </Avatar>

          <Box ta="center">
            <Text size="xl" fw={700} c="blue">
              {user.firstName} {user.lastName}
            </Text>
            <Text c="dimmed">@{user.username}</Text>
          </Box>

          <Group gap="xs">
            <Badge color="blue" size="md" leftSection={<IconUser size={14} />}>
              {user.age} yosh
            </Badge>
            <Badge color={user.gender === 'male' ? 'blue' : 'pink'} size="md" variant="dot">
              {user.gender === 'male' ? 'Erkak' : 'Ayol'}
            </Badge>
          </Group>
        </Stack>
      </Paper>

      <Paper shadow="md" p="md" radius="md" mb="md">
        <Grid gutter="sm">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Group wrap="nowrap" gap="sm">
              <ThemeIcon size="lg" color="blue" variant="light">
                <IconMail size={18} />
              </ThemeIcon>
              <Box>
                <Text size="xs" c="dimmed">Email</Text>
                <Text size="sm" fw={500}>{user.email}</Text>
              </Box>
            </Group>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Group wrap="nowrap" gap="sm">
              <ThemeIcon size="lg" color="green" variant="light">
                <IconPhone size={18} />
              </ThemeIcon>
              <Box>
                <Text size="xs" c="dimmed">Telefon</Text>
                <Text size="sm" fw={500}>{user.phone}</Text>
              </Box>
            </Group>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Group wrap="nowrap" gap="sm">
              <ThemeIcon size="lg" color="red" variant="light">
                <IconMapPin size={18} />
              </ThemeIcon>
              <Box>
                <Text size="xs" c="dimmed">Manzil</Text>
                <Text size="sm" fw={500}>{user.address.city}</Text>
              </Box>
            </Group>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Group wrap="nowrap" gap="sm">
              <ThemeIcon size="lg" color="violet" variant="light">
                <IconBriefcase size={18} />
              </ThemeIcon>
              <Box>
                <Text size="xs" c="dimmed">Kompaniya</Text>
                <Text size="sm" fw={500}>{user.company.name}</Text>
              </Box>
            </Group>
          </Grid.Col>

          <Grid.Col span={12}>
            <Group wrap="nowrap" gap="sm">
              <ThemeIcon size="lg" color="orange" variant="light">
                <IconSchool size={18} />
              </ThemeIcon>
              <Box>
                <Text size="xs" c="dimmed">Ta'lim</Text>
                <Text size="sm" fw={500}>{user.university}</Text>
              </Box>
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>

      <Paper shadow="md" p="md" radius="md">
        <Text size="lg" fw={600} c="blue" mb="md">Foydalanuvchi haqida</Text>
        <Grid gutter="sm">
          <Grid.Col span={6}>
            <Card withBorder p="sm" radius="md">
              <Stack align="center" gap={4}>
                <ThemeIcon size={36} color="blue" variant="light">
                  <IconRuler size={20} />
                </ThemeIcon>
                <Text size="xs" c="dimmed">Bo'y</Text>
                <Text size="lg" fw={700}>{user.height} sm</Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={6}>
            <Card withBorder p="sm" radius="md">
              <Stack align="center" gap={4}>
                <ThemeIcon size={36} color="green" variant="light">
                  <IconScale size={20} />
                </ThemeIcon>
                <Text size="xs" c="dimmed">Og'irlik</Text>
                <Text size="lg" fw={700}>{user.weight} kg</Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={6}>
            <Card withBorder p="sm" radius="md">
              <Stack align="center" gap={4}>
                <ThemeIcon size={36} color="violet" variant="light">
                  <IconEye size={20} />
                </ThemeIcon>
                <Text size="xs" c="dimmed">Ko'z</Text>
                <Text size="md" fw={600}>{user.eyeColor}</Text>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={6}>
            <Card withBorder p="sm" radius="md">
              <Stack align="center" gap={4}>
                <ThemeIcon size={36} color="red" variant="light">
                  <IconHeart size={20} />
                </ThemeIcon>
                <Text size="xs" c="dimmed">Qon</Text>
                <Text size="lg" fw={700}>{user.bloodGroup}</Text>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserDetail;