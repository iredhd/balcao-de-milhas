import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect, useState } from 'react';
import { FlatList, ImageBackground, ImageSourcePropType, StyleSheet, View } from 'react-native';
import {Card, Text, ActivityIndicator, FAB, Portal, Dialog, TextInput, Button, Switch, Dropdown } from '../../components'
import {formatDate, formatDateTime, formatMoney, formatNumber, PROGRAMS } from '@balcao-de-milhas/utils'
import { Avatar, IconButton, Snackbar } from 'react-native-paper';
import Toast from 'react-native-toast-message'
import { useAPI, useToggle } from '../../hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import Fuse from 'fuse.js'
import {Formik} from 'formik'
import {uniqBy} from 'lodash'
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
// import LinkPreview from "expo-link-preview";
import { LinkPreview } from '@flyerhq/react-native-link-preview'
import {getLinkPreview} from 'link-preview-js';


type News = {
    id: number,
    created_at: Date,
    title: string,
    link: string,
    description?: string
}

export default function App() {
    const theme = useTheme()
    
    const [newsList, setNewsList] = useState<News[]>([])

    const [page, setPage] = useState(1)

    const [news, refetchNews] = useAPI({
        url: '/news',
        params: {
            page
        }
    })

    useEffect(() => {
        if (news?.data?.items) {
            setNewsList(state => {
                let newList = [
                    ...state,
                    ...news?.data?.items
                ] 

                return uniqBy(newList, 'id')
            })
        }
    }, [news?.data?.items])
    
  return (
    <View style={styles.container}>
        <FlatList 
            data={newsList || []}
            style={{
                width: '100%',
                backgroundColor: '#292841'
            }}
            contentContainerStyle={{
                minHeight: '100%',
                padding: 5,
            }}
            onRefresh={() => {
                setPage(1)
                setNewsList([])
                refetchNews({
                    params: {
                        page: 1,
                    }
                })}
            }
            refreshing={false}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            ListEmptyComponent={
                () => {
                    return news.loading ? <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}><ActivityIndicator color={theme.colors.primary} size="large" /></View> : <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}><Text style={{
                        color: 'white'
                    }}>Nenhuma notícia encontrada.</Text></View>
                }
            }
            indicatorStyle='white'
            onEndReached={() => {
                if (news?.data?.pagination?.total > newsList.length && !news.loading) {
                    const newPage = page + 1
                    
                    setPage(newPage)

                    refetchNews({
                        params: {
                            page: newPage,
                        }
                    })
                }
            }}
            ListFooterComponentStyle={{
                display: news.loading ? 'none' : 'flex',
                height: 100,
                justifyContent: 'center'
            }}
            ListFooterComponent={(news?.data?.pagination?.total > newsList.length) ? () => <ActivityIndicator color={theme.colors.primary} /> : null}
            renderItem={({ item }) => {
                return (
                    <NewsCard 
                        {...item}
                    />
                )
            }}
            keyExtractor={item => item.id.toString()}
        />
    </View>
  );
}

const NewsCard = ({link: propLink, title, description }: News) => {
    const link = !propLink.includes('http') ? `http://${propLink}` : propLink
    const [isLoading, isLoadingControls] = useToggle(true)
    
    const [preview, setPreview] = useState<undefined | { image?: string, description: string }>()

    useEffect(() => {
        if (description) {
            setPreview({
                description: description
            })
            isLoadingControls.setFalse()
        } else {
            getLinkPreview(link, {
                timeout: 10 * 1000,
                followRedirects: "follow",
            })
            .then((response) => {
                setPreview({
                    image: response.images[response.images.length - 1] || undefined,
                    description: response.description
                })
            })
            .catch(() => {})
            .finally(() => {
                isLoadingControls.setFalse()
            })
        }
    }, [link, description])
    
    return (
        <Card onPress={() => {
            WebBrowser.openBrowserAsync(link)
        }}>
            <Card.Content>
                <Text style={{fontWeight: 'bold' }}>{title}</Text>
                {isLoading && (<View style={{marginTop: 15}}>
                    <ActivityIndicator />
                </View>)}
                {preview?.description && <Text style={{marginTop: 10}}>{preview?.description}</Text>}
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 2
  },

});
