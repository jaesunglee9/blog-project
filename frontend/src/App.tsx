import { useState, useEffect, useCallback } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { MainPage } from './components/MainPage';
import { PostDetailPage } from './components/PostDetailPage';
import { NewPostPage } from './components/NewPostPage';
import { SettingsPage } from './components/SettingsPage';
import {
  getPostsApi,
  logoutApi,
  getPostDetailApi,
  Post as PostType,
} from './api/auth';
import { useAuthStore } from './store/useAuthStore';
import api from './api/config';

function normalizePost(post: any): PostType {
  return {
    ...post,
    preview:
      post.preview ||
      (post.content && post.content.length > 100
        ? post.content.substring(0, 100) + '...'
        : post.content),
    likes: post.likes ?? post.like_count ?? 0,
    likedByUser: post.likedByUser ?? post.liked_by_me ?? false,
    isUserPost: post.isUserPost ?? post.is_mine ?? false,
  } as PostType;
}

export default function App() {
  const { isLoggedIn, isAuthChecked, login, logout, setAuthChecked, setLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/user/me/')
      .then((data: any) => {
        if (data && data.authenticated) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
        setAuthChecked(true);
      })
      .catch(() => {
        setLoggedIn(false);
        setAuthChecked(true);
      });
  }, [setLoggedIn, setAuthChecked]);

  const { data: rawPosts = [], refetch: refetchPosts } = useQuery({
    queryKey: ['posts'],
    queryFn: getPostsApi,
    enabled: isLoggedIn,
  });

  const posts = rawPosts.map(normalizePost);

  const handleLogin = () => {
    login();
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.error(e);
    } finally {
      logout();
      navigate('/login');
    }
  };

  const RequireAuth = () => {
    if (!isAuthChecked) {
      return <div className="text-center py-20 text-gray-500">Loading...</div>;
    }
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
  };

  const AuthedLayout = () => (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />
      <main>
        <Outlet />
      </main>
    </div>
  );

  const PostDetailRoute = () => {
    const { postId } = useParams();

    const { data: rawPost, error, isLoading } = useQuery({
      queryKey: ['post', postId],
      queryFn: () => getPostDetailApi(postId as string),
      enabled: !!postId,
    });

    if (!postId) return <div className="text-center py-20 text-gray-500">Invalid post</div>;
    if (error) return <div className="text-center py-20 text-gray-500">Post not found</div>;
    if (isLoading || !rawPost) return <div className="text-center py-20 text-gray-500">Loading...</div>;

    return <PostDetailPage post={normalizePost(rawPost)} onRefresh={refetchPosts} />;
  };

  const NewPostRoute = () => (
    <NewPostPage
      onSuccess={(newId) => {
        refetchPosts();
        navigate(newId ? `/posts/${newId}` : '/');
      }}
      onCancel={() => navigate('/')}
    />
  );

  const EditPostRoute = () => {
    const { postId } = useParams();

    const { data: rawPost, error, isLoading } = useQuery({
      queryKey: ['post', postId],
      queryFn: () => getPostDetailApi(postId as string),
      enabled: !!postId,
    });

    if (!postId) return <div className="text-center py-20 text-gray-500">Invalid post</div>;
    if (error) return <div className="text-center py-20 text-gray-500">Post not found</div>;
    if (isLoading || !rawPost) return <div className="text-center py-20 text-gray-500">Loading...</div>;

    const post = normalizePost(rawPost);

    return (
      <NewPostPage
        editPost={post}
        onSuccess={(newId) => {
          refetchPosts();
          navigate(newId ? `/posts/${newId}` : `/posts/${post.id}`);
        }}
        onCancel={() => navigate(`/posts/${post.id}`)}
      />
    );
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />
      <Route element={<RequireAuth />}>
        <Route element={<AuthedLayout />}>
          <Route path="/" element={<MainPage posts={posts} />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/posts/new" element={<NewPostRoute />} />
          <Route path="/posts/:postId" element={<PostDetailRoute />} />
          <Route path="/posts/:postId/edit" element={<EditPostRoute />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
