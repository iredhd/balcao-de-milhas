import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect, useState } from 'react';
import { FlatList, ImageBackground, ImageSourcePropType, StyleSheet, View } from 'react-native';
import {Card, Text, ActivityIndicator, FAB, Portal, Dialog, TextInput, Button, Switch, Dropdown } from '../../components'
import {formatDate, formatDateTime, formatMoney, formatNumber, PROGRAMS } from '@balcao-de-milhas/utils'
import { Avatar, IconButton } from 'react-native-paper';
import Toast from 'react-native-toast-message'
import { useAPI, useToggle } from '../../hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import Fuse from 'fuse.js'
import {Formik} from 'formik'
import {uniqBy} from 'lodash'

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


type Bid = {
    id: number,
    company: string,
    price: number,
    is_mentoria: boolean,
    is_mastermiles: boolean,
    pax: number
}

export default function App() {
    const theme = useTheme()
    const [filterModalVisibility, filterModalVisibilityControls] = useToggle(false)
    
    const [bidList, setBidList] = useState<Bid[]>([])

    const [page, setPage] = useState(1)

    const [bids, refetchBids] = useAPI({
        url: '/bid',
        params: {
            page
        }
    })

    const [filters, setFilters] = useState({
        // amount: {
        //     condition: '',
        //     value: ''
        // },
        // pax: {
        //     condition: '',
        //     value: ''
        // },
        // price: {
        //     condition: '',
        //     value: ''
        // },
        company: {
            condition: 'eq',
            value: ''
        },
        is_mastermiles: {
            condition: 'eq',
            value: ''
        },
        is_mentoria: {
            condition: 'eq',
            value: ''
        },
    })

    const hasFilters = !!Object.entries(filters).filter(([_, {value}]) => value !== '').length
    
    useEffect(() => {
        if (bids?.data?.items) {
            setBidList(state => {
                let newList = [
                    ...state,
                    ...bids?.data?.items
                ] 

                return uniqBy(newList, 'id')
            })
        }
    }, [bids?.data?.items])

  return (
    <View style={styles.container}>
        <Portal>
          <Dialog visible={filterModalVisibility} onDismiss={filterModalVisibilityControls.setFalse}>
          <Formik
                initialValues={filters}
                onSubmit={values => {
                    filterModalVisibilityControls.setFalse()
                    setBidList([])
                    setPage(1)

                    setFilters(values)

                    refetchBids({
                        params: {
                            page: 1,
                            filter: values
                        }
                    })
                }}
            >
            {({ handleSubmit, values, setFieldValue }) => {
                return (
                <View>
                <Dialog.Title>Filtros</Dialog.Title>
                <Dialog.Content>
                    <View>
                        <Dropdown
                            label={"Companhia"}
                            value={PROGRAMS.find(item => item.id === values.company.value)?.name}
                            onSelection={({ selectedList: [value] }) => {
                                setFieldValue('company.value', value?.id || '')
                            }}
                            selected={values.company.value}
                            options={PROGRAMS.map(item => ({
                                id: item.id,
                                value: item.name
                            }))}
                        />    
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10}}>
                            <Text>Membro Mastermiles</Text>
                            <Switch trackColor={theme.colors.primary} value={values.is_mastermiles.value} onValueChange={() => {
                                setFieldValue('is_mastermiles.value', !values.is_mastermiles.value || '')
                            }} />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text>Membro Mentoria</Text>
                            <Switch trackColor={theme.colors.primary} value={values.is_mentoria.value} onValueChange={() => {
                                setFieldValue('is_mentoria.value', !values.is_mentoria.value || '')
                            }} />
                        </View>
                    </View>
                </Dialog.Content>
                <Dialog.Actions>
                <Button mode="contained" onPress={handleSubmit}>
                    Filtrar
                </Button>
                </Dialog.Actions>
            </View>
            )}}
            </Formik>
          </Dialog>
        </Portal>
        <FAB
            icon={hasFilters ? "filter-check" : "filter"}
            style={[styles.fab, {backgroundColor: theme.colors.primary}]}
            onPress={filterModalVisibilityControls.setTrue}
        />
        <FlatList 
            data={bidList || []}
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
                refetchBids({
                    params: {
                        page: 1,
                        filter: filters
                    }
                })}
            }
            refreshing={bids.loading && !!bidList.length}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            ListEmptyComponent={
                () => {
                    return bids.loading ? <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}><ActivityIndicator color={theme.colors.primary} size="large" /></View> : <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}><Text style={{
                        color: 'white'
                    }}>Nenhuma oferta encontrada.</Text></View>
                }
            }
            indicatorStyle='white'
            onEndReached={() => {
                if (bids?.data?.pagination?.total > bidList.length && !bids.loading) {
                    const newPage = page + 1
                    
                    setPage(newPage)

                    refetchBids({
                        params: {
                            page: newPage,
                            filter: filters
                        }
                    })
                }
            }}
            ListFooterComponentStyle={{
                display: bids.loading ? 'none' : 'flex',
                height: 100,
                justifyContent: 'center'
            }}
            ListFooterComponent={(bids?.data?.pagination?.total > bidList.length) ? () => <ActivityIndicator color={theme.colors.primary} /> : null}
            renderItem={({item }) => {
                return (
                        <Card style={{height: 180, justifyContent: 'center'}} onPress={() => {
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
                                        {/* <Text>{item.id}</Text> */}
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
                                        {item.is_mastermiles && (<View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <MaterialCommunityIcons name='star' style={{marginRight: 2}}  />
                                            <Text style={{fontStyle: 'italic', fontSize: 12}}>Membro Mastermiles</Text>
                                        </View>)}
                                        {item.is_mentoria && (<View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <MaterialCommunityIcons name='star' style={{marginRight: 2}}  />
                                            <Text style={{fontStyle: 'italic', fontSize: 12}}>Mentorado</Text>
                                        </View>)}
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 2
  },

});
