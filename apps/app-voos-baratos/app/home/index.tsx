import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native';
import {Card, Text, ActivityIndicator, FAB, Portal, Dialog, TextInput, Button, Switch, Dropdown } from '../../components'
import {formatDate, formatDateTime, formatMoney, formatNumber, PROGRAMS } from '@balcao-de-milhas/utils'
import { Avatar, IconButton, Snackbar } from 'react-native-paper';
import Toast from 'react-native-toast-message'
import { API, API_URL, useAPI, useToggle } from '../../hooks';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageView from "react-native-image-viewing";

type Flight = {
    id: number,
    created_at: Date,
    text: string,
}

export default function App() {
    const theme = useTheme()
    
    const [flightsList, setFlightsList] = useState<Flight[]>([])

    const [page, setPage] = useState(1)

    const [flights, refetchFlights] = useAPI({
        url: '/flight',
        params: {
            page
        }
    })

    useEffect(() => {
        if (flights?.data?.items) {
            setFlightsList(state => {
                let newList = [
                    ...state,
                    ...flights?.data?.items
                ] 

                return uniqBy(newList, 'id')
            })
        }
    }, [flights?.data?.items])
    
  return (
    <View style={styles.container}>
        <FlatList 
            data={flightsList || []}
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
                setFlightsList([])
                refetchFlights({
                    params: {
                        page: 1,
                    }
                })}
            }
            refreshing={false}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            ListEmptyComponent={
                () => {
                    return flights.loading ? <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}><ActivityIndicator color={theme.colors.primary} size="large" /></View> : <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}><Text style={{
                        color: 'white'
                    }}>Nenhum voo encontrado.</Text></View>
                }
            }
            indicatorStyle='white'
            onEndReached={() => {
                if (flights?.data?.pagination?.total > flightsList.length && !flights.loading) {
                    const newPage = page + 1
                    
                    setPage(newPage)

                    refetchFlights({
                        params: {
                            page: newPage,
                        }
                    })
                }
            }}
            ListFooterComponentStyle={{
                display: flights.loading ? 'none' : 'flex',
                height: 100,
                justifyContent: 'center'
            }}
            ListFooterComponent={(flights?.data?.pagination?.total > flightsList.length) ? () => <ActivityIndicator color={theme.colors.primary} /> : null}
            renderItem={({ item }) => {
                return (
                    <FlightCard 
                        {...item}
                    />
                )
            }}
            keyExtractor={item => item.id.toString()}
        />
    </View>
  );
}

const FlightCard = ({text, created_at, id}: Flight) => {
    const [isModalOpen, modalControls] = useToggle(false)
    const [deviceId, setDeviceId] = useState('')

    useEffect(() => {
        (async () => {
            const id = await AsyncStorage.getItem('device-id')
            setDeviceId(String(id))
        })()
    }, [])
    
    return (
        <Fragment>
        <ImageView
            images={[
                {
                    uri: `${API_URL}/flight/${id}/file`,
                    headers: {
                        ['device-id']: deviceId,
                        secret: process.env.EXPO_PUBLIC_API_SECRET
                    }
                }
            ]}
            imageIndex={0}
            visible={isModalOpen}
            onRequestClose={modalControls.setFalse}
        />
        <Card>
            <TouchableOpacity
                onPress={modalControls.setTrue}
            >
            <Card.Cover 
                source={{
                    uri: `${API_URL}/flight/${id}/file`,
                    headers: {
                        ['device-id']: deviceId,
                        secret: process.env.EXPO_PUBLIC_API_SECRET
                    }
                }}
                style={{
                    height: Dimensions.get('screen').height / 2
                }}
                resizeMode="cover"
            />
            </TouchableOpacity>
            <Card.Content style={{
                paddingTop: 15
            }}>
                <Text style={{fontStyle: 'italic', marginBottom: 15 }}>{formatDateTime(created_at)}</Text>
                <Text style={{fontWeight: 'bold' }}>{text}</Text>
            </Card.Content>
        </Card>
        </Fragment>
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
