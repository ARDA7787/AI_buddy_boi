import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatMessage } from '../types';
import { apiClient } from '../api/apiClient';
import { useAppStore } from '../store';
import { colors, spacing, typography } from '../theme';

export const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();
  const activeTripId = useAppStore(state => state.activeTripId);

  const { data: messages = [] } = useQuery({
    queryKey: ['chatMessages', activeTripId],
    queryFn: () => apiClient.getChatMessages(activeTripId || undefined),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => apiClient.postChatMessage(content, activeTripId || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', activeTripId] });
      setMessage('');
    },
  });

  const handleSend = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageContainer,
        item.role === 'user' ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text style={[styles.messageText, item.role === 'user' && styles.userMessageText]}>
        {item.content}
      </Text>
      <Text style={[styles.timestamp, item.role === 'user' && styles.userTimestamp]}>
        {formatTime(item.timestamp)}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Start a conversation with your AI Travel Buddy!</Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Ask me anything about your trip..."
          placeholderTextColor={colors.text.tertiary}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim() || sendMessageMutation.isPending}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesList: {
    padding: spacing.md,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
  },
  messageText: {
    fontSize: typography.fontSizes.md,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userMessageText: {
    color: colors.text.inverse,
  },
  timestamp: {
    fontSize: typography.fontSizes.xs,
    color: colors.text.tertiary,
  },
  userTimestamp: {
    color: colors.text.inverse,
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    fontSize: typography.fontSizes.md,
    color: colors.text.primary,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: colors.text.inverse,
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.semibold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSizes.md,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
