import { TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface AlertStatsProps {
    totalAlerts: number
    criticalAlerts: number
    resolvedAlerts: number
}

export function AlertStats({ totalAlerts, criticalAlerts, resolvedAlerts }: AlertStatsProps) {
    const resolutionRate = totalAlerts > 0
        ? Math.round((resolvedAlerts / totalAlerts) * 100)
        : 0

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Total Alerts Card */}
            <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5" />
                <CardHeader className="relative pb-2">
                    <CardDescription className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        Total des Alertes
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold">{totalAlerts}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                    <p className="text-xs text-muted-foreground">
                        Depuis le début de la journée
                    </p>
                </CardContent>
            </Card>

            {/* Critical Alerts Card */}
            <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5" />
                <CardHeader className="relative pb-2">
                    <CardDescription className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Alertes Critiques
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-red-600">
                        {criticalAlerts}
                    </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                    <p className="text-xs text-muted-foreground">
                        Nécessitent une attention immédiate
                    </p>
                </CardContent>
            </Card>

            {/* Resolution Rate Card */}
            <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/5" />
                <CardHeader className="relative pb-2">
                    <CardDescription className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Taux de Résolution
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-green-600">
                        {resolutionRate}%
                    </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                    <p className="text-xs text-muted-foreground">
                        {resolvedAlerts} alertes résolues sur {totalAlerts}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
