import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect, useState } from 'react';
import { FlatList, ImageBackground, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import moment from 'moment'
import currency from 'currency.js'

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
    created_at: Date
    recommendations: number
    claims: number,
    amount: number,
    member_since: Date
    cancell_return_percentage: number
    offer_id: number
    direction: 'BUY' | 'SELL'
    number_of_communities: number
    date_of_first_join: Date
}

const bidTypes = [
    {id: 'BUY', value: 'Compra'},
    {id: 'SELL', value: 'Venda'},
]

export default function App() {
    const theme = useTheme()
    const [filterModalVisibility, filterModalVisibilityControls] = useToggle(false)
    const [redirectModalVisibility, redirectModalVisibilityControls] = useToggle(false)
    const [copySnackbarVisibility, copySnackbarVisibilityControls] = useToggle(false)
    const [optionsFABVisibility, optionsFABVisibilityControls] = useToggle(false)
    const [offerId, setOfferId] = useState('')
    
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
        direction: {
            condition: 'eq',
            value: ''
        },
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
                        <Dropdown
                            label={"Tipo de Oferta"}
                            value={bidTypes.find(item => item.id === values.direction.value)?.value || ''}
                            onSelection={({ selectedList: [value] }) => {
                                setFieldValue('direction.value', value?.id || '')
                            }}
                            hideSearchBox
                            selected={values.direction.value}
                            options={bidTypes}
                        /> 
                        {/* <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10}}>
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
                        </View> */}
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
        <Portal>
          <Dialog visible={redirectModalVisibility} onDismiss={redirectModalVisibilityControls.setFalse}>
            <Snackbar
                visible={copySnackbarVisibility}
                onDismiss={copySnackbarVisibilityControls.setFalse}
                shouldRasterizeIOS
                style={{
                    position: 'absolute'
                }}
                >
                Código copiado com sucesso!
            </Snackbar>
            <Dialog.Title>Atenção!</Dialog.Title>
            <Dialog.Content>
                <View>
                    <Text>
                        Copie o código da oferta abaixo. Em seguida, clique em "Acessar Oferta" para iniciar a negociação.
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10}}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 20
                    }}> 
                        {offerId}
                    </Text>
                    <IconButton icon="content-copy" onPress={() => {
                        Clipboard.setStringAsync(offerId)
                        copySnackbarVisibilityControls.setTrue()
                    }} />
                </View>
            </Dialog.Content>
            <Dialog.Actions style={{justifyContent: 'center'}}>
                <Button mode="contained" 
                    onPress={() => {
                        const bid = bidList.find(item => item.offer_id === Number(offerId))

                        const link = bid?.direction === 'BUY' ? 'https://t.me/BDMQUEROVENDERBOT' : 'https://t.me/BDMV1BOT'

                        Linking.openURL(link);
                    }} 
                    style={{justifyContent: 'center', alignItems: 'center'}}
                >
                    Acessar Oferta
                </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
            <FAB.Group
                visible
                fabStyle={{
                    right: 0,
                    marginBottom: 60,
                    zIndex: 4,
                    backgroundColor: theme.colors.primary
                }}
                open={optionsFABVisibility}
                icon={optionsFABVisibility ? 'dots-vertical' : 'dots-horizontal'}
                actions={[
                    {
                    icon: 'hand-coin',
                    label: 'Comprar',
                    onPress: () => {
                        Linking.openURL('https://t.me/BDMBOT')
                    },
                    small: false,
                    },
                    {
                    icon: 'cash-plus',
                    label: 'Vender',
                    onPress: () => {
                        Linking.openURL('https://t.me/BDMBOTVBOT')
                    },
                    small: false,
                    },
                    {
                        icon: hasFilters ? "filter-check" : "filter",
                        label: 'Filtrar',
                        onPress: filterModalVisibilityControls.setTrue,
                        small: false,
                    },
                ]}
                onStateChange={({open}) => {
                    if (!open) {
                        optionsFABVisibilityControls.setFalse()
                    } else {
                        optionsFABVisibilityControls.setTrue()
                    }
                }}
            />
        </Portal>
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
                setBidList([])
                refetchBids({
                    params: {
                        page: 1,
                        filter: filters
                    }
                })}
            }
            refreshing={false}
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
                const recommendations = Math.floor(item.recommendations / 10) * 10
                const claims = Math.floor(item.claims / 10) * 10

                const recommendationsText = recommendations === 0 ? '0' : recommendations < 10 ? '-10' : `+${recommendations}`
                const claimsText = claims === 0 ? '0' : claims <  10 ? '-10' : `+${claims}`

                const [result] = fuse.search<typeof PROGRAMS>(item.company, {
                    limit: 1
                })

                const source: ImageSourcePropType = result?.item?.icon ? {
                    uri: result?.item.icon
                } : require('../../assets/no-image.png')

                return (
                        <TouchableOpacity onPress={() => {
                            setOfferId(`${item.offer_id}`)
                            Clipboard.setStringAsync(offerId)
                            copySnackbarVisibilityControls.setTrue()
                            redirectModalVisibilityControls.setTrue()
                        }}>
                        <Card style={{height: 220, justifyContent: 'center'}} >
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 10
                            }}>
                                <View>
                                    <ImageBackground resizeMode='contain' source={source}>
                                        <View style={{width: 50, height: 50}} />
                                    </ImageBackground>
                                </View>
                                <View style={{flex: 1, padding: 10 }}>
                                    <View style={{}}>
                                        <Text style={{fontWeight: 'bold'}}>{`${(item.direction === 'BUY' ? 'COMPRA' : 'VENDA').toUpperCase()}: ${formatNumber(item.amount)} - ${formatMoney(item.price)}/k`}</Text>
                                        <Text>{`${item.company} - ${item.pax} CPF(s)`}</Text>
                                        <Text>{`${formatMoney(currency(currency(item.amount, {precision: 3}).divide(1000).value, {precision: 2}).multiply(item.price).value)}`}</Text>
                                    </View>
                                    <View style={{ marginTop: 10}}>
                                        <Text>{formatDateTime(item.created_at)}</Text>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{marginRight: 2}}>{recommendationsText}</Text><MaterialCommunityIcons name='thumb-up' />
                                            <Text style={{marginRight: 2, marginLeft: 5}}>{claimsText}</Text><MaterialCommunityIcons name='thumb-down' />
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
                                            <Text style={{fontStyle: 'italic', fontSize: 12}}>Membro do balcão há {moment().diff(moment(item.member_since),'months')} meses</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{fontStyle: 'italic', fontSize: 12}}>Membro de {item.number_of_communities} curso{item.number_of_communities > 1 ? 's': ''}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{fontStyle: 'italic', fontSize: 12}}>Entrou no primeiro curso há {moment().diff(moment(item.member_since),'months')} meses</Text>
                                        </View>
                                        <Text style={{fontStyle: 'italic', fontSize: 12}}>{`${formatNumber(item.cancell_return_percentage)}% de reembolso em caso de cancelamento`}</Text>
                                    </View>
                                </View>
                                <View>
                                    <IconButton icon="arrow-right" />
                                </View>
                            {/* <Card.Title
                                style={{
                                    // flex: 1,
                                    backgroundColor: 'red',
                                    // justifyContent: 'space-between'
                                }}
                                subtitleStyle={{
                                    marginTop: 10
                                }}
                                title={
                                    <View style={{backgroundColor: 'yellow', flex: 1}}>
                                        <Text style={{fontWeight: 'bold'}}>{`${(item.direction === 'BUY' ? 'COMPRA' : 'VENDA').toUpperCase()}: ${formatNumber(item.amount)} - ${formatMoney(item.price)}/k`}</Text>
                                        <Text>{`${item.company} - ${item.pax} CPF(s)`}</Text>
                                        <Text>{`${formatMoney(currency(currency(item.amount, {precision: 3}).divide(1000).value, {precision: 2}).multiply(item.price).value)}`}</Text>
                                    </View>

                                }
                                subtitle={
                                    <View style={{backgroundColor: 'green', flex: 1}}>
                                        <Text>{formatDateTime(item.created_at)}</Text>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{marginRight: 2}}>{recommendationsText}</Text><MaterialCommunityIcons name='thumb-up' />
                                            <Text style={{marginRight: 2, marginLeft: 5}}>{claimsText}</Text><MaterialCommunityIcons name='thumb-down' />
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
                                            <Text style={{fontStyle: 'italic', fontSize: 12}}>Membro do balcão há {moment().diff(moment(item.member_since),'months')} meses</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{fontStyle: 'italic', fontSize: 12}}>Membro de {item.number_of_communities} curso{item.number_of_communities > 1 ? 's': ''}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{fontStyle: 'italic', fontSize: 12}}>Entrou no primeiro curso há {moment().diff(moment(item.member_since),'months')} meses</Text>
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
                            /> */}
                            </View>
                        </Card>
                        </TouchableOpacity>
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
