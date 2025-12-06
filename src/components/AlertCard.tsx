import { useState } from 'react'
import { supabase } from '../supabase/client'
import { Phone, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

interface AlertCardProps {
    id: string
    patientName: string
    equipmentType: string
    severity: 'critique' | 'urgente' | 'normale'
    phone: string
    address: string
    createdAt: string
    isResolved?: boolean
}

export function AlertCard({
    id,
    patientName,
    equipmentType,
    severity,
    phone,
    address,
    createdAt,
    isResolved = false
}: AlertCardProps) {
    const [isResolving, setIsResolving] = useState(false)
    const [resolved, setResolved] = useState(isResolved)

    const severityColors = {
        critique: 'destructive',
        urgente: 'default',
        normale: 'secondary'
    } as const

    const severityIcons = {
        critique: <AlertCircle className="h-4 w-4" />,
        urgente: <Clock className="h-4 w-4" />,
        normale: <CheckCircle2 className="h-4 w-4" />
    }

    const handleCall = () => {
        window.location.href = `tel:${phone}`
    }

    const handleResolve = async () => {
        setIsResolving(true)
        try {
            const { error } = await supabase
                .from('alerts')
                .update({
                    is_resolved: true,
                    resolved_at: new Date().toISOString()
                })
                .eq('id', id)

            if (error) throw error

            setResolved(true)
        } catch (error) {
            console.error('Error resolving alert:', error)
            alert('Erreur lors de la résolution de l\'alerte')
        } finally {
            setIsResolving(false)
        }
    }

    return (
        <Card className={resolved ? 'opacity-60' : 'border-l-4'} style={{
            borderLeftColor: !resolved && severity === 'critique' ? 'hsl(var(--destructive))' :
                !resolved && severity === 'urgente' ? 'hsl(var(--primary))' :
                    'transparent'
        }}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">{patientName}</CardTitle>
                        <CardDescription>{equipmentType}</CardDescription>
                    </div>
                    <Badge variant={severityColors[severity]} className="flex items-center gap-1">
                        {severityIcons[severity]}
                        {severity}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                    <p><strong>Adresse:</strong> {address}</p>
                    <p><strong>Téléphone:</strong> {phone}</p>
                    <p><strong>Détectée:</strong> {new Date(createdAt).toLocaleString('fr-FR')}</p>
                </div>

                {!resolved && (
                    <div className="flex gap-2">
                        <Button
                            onClick={handleCall}
                            variant="outline"
                            className="flex-1"
                            size="sm"
                        >
                            <Phone className="h-4 w-4 mr-2" />
                            Appeler
                        </Button>
                        <Button
                            onClick={handleResolve}
                            disabled={isResolving}
                            variant="default"
                            className="flex-1"
                            size="sm"
                        >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {isResolving ? 'Résolution...' : 'Marquer résolu'}
                        </Button>
                    </div>
                )}

                {resolved && (
                    <Badge variant="outline" className="w-full justify-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Alerte résolue
                    </Badge>
                )}
            </CardContent>
        </Card>
    )
}
