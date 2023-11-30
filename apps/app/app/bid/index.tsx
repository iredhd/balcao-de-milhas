import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useState } from 'react';
import { FlatList, ImageBackground, ImageSourcePropType, StyleSheet, View } from 'react-native';
import {Card, Text, ActivityIndicator} from '../../components'
import {formatDate, formatDateTime, formatMoney, formatNumber, PROGRAMS } from '@balcao-de-milhas/utils'
import { Avatar, IconButton } from 'react-native-paper';
import Toast from 'react-native-toast-message'
import { useAPI } from '../../hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import Fuse from 'fuse.js'

const fuse = new Fuse(PROGRAMS, {
    minMatchCharLength: 2,
    threshold: 0.5,
    isCaseSensitive: false,
    useExtendedSearch: true,
    ignoreFieldNorm: true,
    ignoreLocation: true,
    shouldSort: true,
    fieldNormWeight: 0,

    keys: [
      'keywords'
    ]
  })

export default function App() {
    const theme = useTheme()
    
    const [bids, refetchBids] = useAPI({
        url: '/bid',
        params: {
            page: 1
        }
    })

  return (
    <View style={styles.container}>
        <FlatList 
            data={bids?.data?.items || []}
            style={{
                width: '100%',
                backgroundColor: '#292841'
            }}
            contentContainerStyle={{
                minHeight: '100%',
                padding: 5,
            }}
            onRefresh={() => {
                
                refetchBids({
                    params: {
                        page: 1
                    }
                })}
            }
            refreshing={bids.loading}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            ListEmptyComponent={
                () => {
                    return bids.loading ? <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}><ActivityIndicator color={theme.colors.primary} /></View> : <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}><Text style={{
                        color: 'white'
                    }}>Nenhuma oferta encontrada.</Text></View>
                }
            }
            indicatorStyle='white'
            onEndReached={() => {
                console.log('fim')
            }}
            ListFooterComponentStyle={{
                display: bids.loading ? 'none' : 'flex',
                height: 100,
                justifyContent: 'center'
            }}
            ListFooterComponent={(bids?.data?.items || []).length ? () => <ActivityIndicator color={theme.colors.primary} /> : null}
            renderItem={({item }) => {
                return (
                        <Card style={{height: 180, justifyContent: 'center'}} onPress={() => {
                            console.log('oi')
                            
                            Toast.show({
                                type: 'success',
                                text1: 'Teste!',
                                text2: 'Testando...'
                            })
                        }}>
                            <Card.Title
                                style={{
                                    flex: 1,
                                }}
                                subtitleStyle={{
                                    marginTop: 10
                                }}
                                title={
                                    <View>
                                        <Text style={{fontWeight: 'bold'}}>{`${formatNumber(item.amount)} - ${formatMoney(item.price)}/k`}</Text>
                                        <Text>{`${item.company} - ${item.pax} CPF(s)`}</Text>
                                    </View>
                                }
                                subtitle={
                                    <View>
                                        <Text>{formatDateTime(item.created_at)}</Text>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{marginRight: 2}}>{formatNumber(item.recommendations)}</Text><MaterialCommunityIcons name='thumb-up' />
                                            <Text style={{marginRight: 2, marginLeft: 5}}>{formatNumber(item.claims)}</Text><MaterialCommunityIcons name='thumb-down' />
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <MaterialCommunityIcons name='star' style={{marginRight: 2}}  />
                                            <Text style={{fontStyle: 'italic', fontSize: 12}}>Membro Mastermiles</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <MaterialCommunityIcons name='star' style={{marginRight: 2}}  />
                                            <Text style={{fontStyle: 'italic', fontSize: 12}}>Mentorado</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{fontStyle: 'italic', fontSize: 12}}>Membro desde {formatDate(item.member_since)}</Text>
                                        </View>
                                        <Text style={{fontStyle: 'italic', fontSize: 12}}>{`${formatNumber(item.cancell_return_percentage)}% de reembolso em caso de cancelamento`}</Text>
                                    </View>
                                }
                                left={() => {
                                    const [result] = fuse.search<typeof PROGRAMS>(item.company, {
                                        limit: 1
                                    })

                                    const source: ImageSourcePropType = result?.item?.icon ? {
                                        uri: result?.item.icon
                                    } : require('../../assets/no-image.png')

                                    return (
                                        <ImageBackground resizeMode='contain' source={source}>
                                            <View style={{width: 50, height: 50}} />
                                        </ImageBackground>
                                    )
                                }}
                                right={() => {
                                    return (
                                        <IconButton icon="arrow-right" />
                                    )
                                }}
                            />
                        </Card>
                )
            }}
            keyExtractor={item => item.id.toString()}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
