import { Activity, Users, Wrench, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface DashboardStatsProps {
    totalPatients: number
    activeDevices: number
    pendingInterventions: number
    avgComplianceRate: number // Percentage
}

interface StatCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    trend?: {
        value: number
        isPositive: boolean
    }
    color: string
}

function StatCard({ title, value, icon, trend, color }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className={`p-2 rounded-full ${color}`}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {trend && (
                    <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'} flex items-center gap-1 mt-1`}>
                        <TrendingUp className={`h-3 w-3 ${!trend.isPositive && 'rotate-180'}`} />
                        {trend.isPositive ? '+' : ''}{trend.value}% vs mois dernier
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

export function DashboardStats({
    totalPatients,
    activeDevices,
    pendingInterventions,
    avgComplianceRate
}: DashboardStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Patients Actifs"
                value={totalPatients}
                icon={<Users className="h-4 w-4 text-white" />}
                color="bg-blue-500"
                trend={{ value: 8, isPositive: true }}
            />

            <StatCard
                title="Appareils en Service"
                value={activeDevices}
                icon={<Activity className="h-4 w-4 text-white" />}
                color="bg-green-500"
                trend={{ value: 12, isPositive: true }}
            />

            <StatCard
                title="Interventions en Attente"
                value={pendingInterventions}
                icon={<Wrench className="h-4 w-4 text-white" />}
                color="bg-orange-500"
                trend={{ value: 3, isPositive: false }}
            />

            <StatCard
                title="Taux d'Observance Moyen"
                value={`${avgComplianceRate}%`}
                icon={<TrendingUp className="h-4 w-4 text-white" />}
                color="bg-purple-500"
                trend={{ value: 5, isPositive: true }}
            />
        </div>
    )
}
