<?php
class Hex
{
    public function get($id)
    {
        $result = $this->request("SELECT * FROM t_hex WHERE id = '$id';");

        if ($result) 
        {
            foreach($result as $row) 
            {
                echo $row['hex'];
            }
        }
    }

    public function post($id, $param)
    {
        $this->request("INSERT INTO t_hex (id, hex) VALUES ('$id', '$param');");
    }

    public function delete($id)
    {
        $this->request("DELETE FROM t_hex WHERE id = '$id';");
    }

    public function put($id, $param)
    {
        $this->request("UPDATE t_hex SET hex = '$param' WHERE id = '$id';");
    }

    private function request($query)
    {
        $link = mysqli_connect('localhost','har','T10772186h','hex');

        if (mysqli_connect_errno())
        {
            echo "データベースに接続できません:" . mysqli_connect_error() . "\n";
        }

        $result = mysqli_query($link, $query);

        mysqli_close($link);

        return $result;
    }
}
?>
