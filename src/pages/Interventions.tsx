import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import { CheckCircle2, Clock, User, Wrench } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table'

interface ResolvedAlert {
    id: string
    patient_name: string
    equipment_type: string
    severity: 'critique' | 'urgente' | 'normale'
    address: string
    created_at: string
    resolved_at: string
}

export function Interventions() {
    const [resolvedAlerts, setResolvedAlerts] = useState<ResolvedAlert[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResolvedAlerts = async () => {
            try {
                const { data, error } = await supabase
                    .from('alerts')
                    .select('*')
                    .eq('is_resolved', true)
                    .order('resolved_at', { ascending: false })

                if (error) throw error
                setResolvedAlerts(data || [])
            } catch (error) {
                console.error('Error fetching resolved alerts:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchResolvedAlerts()

        // Real-time subscription for new resolutions
        const channel = supabase
            .channel('resolved-alerts')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'alerts',
                    filter: 'is_resolved=eq.true'
                },
                () => {
                    fetchResolvedAlerts()
                }
            )
            .subscribe()

        return () => {
            channel.unsubscribe()
        }
    }, [])

    const severityColors = {
        critique: 'destructive',
        urgente: 'default',
        normale: 'secondary'
    } as const

    const formatDuration = (start: string, end: string) => {
        const diff = new Date(end).getTime() - new Date(start).getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)

        if (hours > 0) {
            return `${hours}h ${minutes % 60}min`
        }
        return `${minutes}min`
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <h1 className="text-4xl font-bold">Historique des Interventions</h1>
                </div>
                <p className="text-muted-foreground">
                    Toutes les alertes résolues - {resolvedAlerts.length} intervention{resolvedAlerts.length > 1 ? 's' : ''}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Alertes Résolues</CardTitle>
                    <CardDescription>
                        Historique chronologique des interventions effectuées
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
                            <p className="mt-4 text-muted-foreground">Chargement...</p>
                        </div>
                    ) : resolvedAlerts.length === 0 ? (
                        <div className="text-center py-12">
                            <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Aucune intervention enregistrée</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[180px]">Patient</TableHead>
                                        <TableHead>Équipement</TableHead>
                                        <TableHead>Sévérité</TableHead>
                                        <TableHead className="hidden md:table-cell">Adresse</TableHead>
                                        <TableHead>Détectée</TableHead>
                                        <TableHead>Résolue</TableHead>
                                        <TableHead className="text-right">Durée</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {resolvedAlerts.map((alert) => (
                                        <TableRow key={alert.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    {alert.patient_name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Wrench className="h-4 w-4 text-muted-foreground" />
                                                    {alert.equipment_type}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={severityColors[alert.severity]}>
                                                    {alert.severity}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                                {alert.address}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(alert.created_at).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(alert.resolved_at).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1 text-sm">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDuration(alert.created_at, alert.resolved_at)}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
